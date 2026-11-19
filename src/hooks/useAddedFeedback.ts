import { useEffect, useState } from "react";

const ADDED_FEEDBACK_MS = 1500

// Briefly flips to true after `trigger()` so an "Added" state can be shown.
export function useAddedFeedback(): [boolean, () => void] {
    const [justAdded, setJustAdded] = useState(false)

    useEffect(() => {
        if (!justAdded) {
            return
        }
        const timer = setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS)
        return () => clearTimeout(timer)
    }, [justAdded])

    return [justAdded, () => setJustAdded(true)]
}
