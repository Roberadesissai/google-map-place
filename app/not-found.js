import ErrorDisplay from '@/components/ErrorDisplay'

export default function NotFound() {
  return (
    <ErrorDisplay 
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      type="404"
    />
  )
} 