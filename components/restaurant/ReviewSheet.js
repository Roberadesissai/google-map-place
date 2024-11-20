import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import ReviewForm from '@/components/ReviewForm'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { toast } from 'sonner'

export default function ReviewSheet({ open, onOpenChange, restaurantId }) {
  const { user } = useAuth()

  const handleSubmitReview = async ({ rating, review }) => {
    if (!user) {
      toast.error('Please sign in to leave a review')
      return
    }

    try {
      const reviewRef = doc(db, 'reviews', `${user.uid}_${restaurantId}`)
      await setDoc(reviewRef, {
        userId: user.uid,
        restaurantId,
        rating,
        review,
        createdAt: new Date().toISOString(),
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || null
      })

      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting review:', error)
      throw error
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Write a Review</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ReviewForm
            restaurantId={restaurantId}
            onSubmit={handleSubmitReview}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
} 