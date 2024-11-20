import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Star, MessageCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function ReviewsTab({ reviews = [], onAddReview }) {
  const { user } = useAuth()

  return (
    <div className="space-y-4">
      {/* Add Review Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {user && (
          <Button onClick={onAddReview}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{review.author_name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.time * 1000).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span>{review.rating}</span>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{review.text}</p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No reviews yet</p>
          {user && (
            <Button variant="link" onClick={onAddReview}>
              Be the first to write a review
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 