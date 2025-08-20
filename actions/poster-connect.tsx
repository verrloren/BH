import { useRouter } from "next/router"
import { useEffect } from "react"

export default function PosterConnect() {
  const router = useRouter()
  const { code } = router.query

  useEffect(() => {
    if (code) {
      fetch(`/api/auth/poster?code=${code}`)
        .then(r => r.json())
        .then(data => {
          console.log("Poster token:", data.token)
        })
    }
  }, [code])

  return <div>Connecting to Poster...</div>
}