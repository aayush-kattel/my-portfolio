import { useState, useEffect } from "react";

export default function useTyping(words, typingSpeed = 75, deleteSpeed = 40, pauseTime = 1800) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;

    if (!deleting) {
      timeout = setTimeout(() => {
        setText(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pauseTime);
        } else {
          setCharIdx((c) => c + 1);
        }
      }, typingSpeed);
    } else {
      timeout = setTimeout(() => {
        setText(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx((w) => (w + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx((c) => c - 1);
        }
      }, deleteSpeed);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, typingSpeed, deleteSpeed, pauseTime]);

  return text;
}
