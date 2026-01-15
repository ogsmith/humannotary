import type { HttpContext } from '@adonisjs/core/http'
import { supabase } from '#config/supabase'
import { verifyTypingMetrics, type TypingMetrics } from '#services/typing_verifier'
import { nanoid } from 'nanoid'

export default class PostsController {
  async index({ inertia }: HttpContext) {
    return inertia.render('home')
  }

  async write({ inertia }: HttpContext) {
    return inertia.render('write')
  }

  async store({ request, response }: HttpContext) {
    const { content, metrics } = request.body() as {
      content: string
      metrics: TypingMetrics
    }

    if (!content || !content.trim()) {
      return response.badRequest({ error: 'Content is required' })
    }

    if (!metrics) {
      return response.badRequest({ error: 'Typing metrics are required' })
    }

    // Verify the typing metrics
    const verification = verifyTypingMetrics(metrics, content.length)

    // Generate a unique ID
    const id = nanoid(7)

    // Store in Supabase
    const { error } = await supabase.from('posts').insert({
      id,
      content: content.trim(),
      typing_metrics: metrics,
      human_score: verification.humanScore,
      verified: verification.verified,
    })

    if (error) {
      console.error('Supabase error:', error)
      return response.internalServerError({ error: 'Failed to save post' })
    }

    return response.ok({
      id,
      verified: verification.verified,
      humanScore: verification.humanScore,
      reasons: verification.reasons,
    })
  }

  async show({ params, inertia }: HttpContext) {
    const { id } = params

    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !post) {
      return inertia.render('posts/show', {
        post: null,
        error: 'Post not found',
      })
    }

    return inertia.render('posts/show', {
      post: {
        id: post.id,
        content: post.content,
        verified: post.verified,
        humanScore: post.human_score,
        createdAt: post.created_at,
      },
      error: null,
    })
  }

  async search({ request, response }: HttpContext) {
    const id = request.input('id', '').trim()

    if (!id) {
      return response.badRequest({ error: 'ID is required' })
    }

    const { data: post, error } = await supabase
      .from('posts')
      .select('id')
      .eq('id', id)
      .single()

    if (error || !post) {
      return response.notFound({ error: 'Post not found' })
    }

    return response.ok({ exists: true, id: post.id })
  }
}
