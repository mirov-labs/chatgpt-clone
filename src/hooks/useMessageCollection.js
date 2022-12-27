import { useState } from 'react'
import { firestore, auth } from '../firebase'
import { collection, addDoc } from "firebase/firestore";

/**
 * Saves a message to the "messages" collection in Firestore.
 *
 * @param {Object} msg - The message to save.
 * @return {Promise} A promise that resolves when the message has been saved.
 */
const saveToFirestore = async (msg) => {
  const email = auth.currentUser.email;
  try {
    await addDoc(collection(firestore, "messages"), { ...msg, email });
    // console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


/**
 * A custom hook for managing the conversation between the user and the AI.
 *
 * @returns {Object} An object containing the `messages` array and the `addMessage` function.
 */
const useMessageCollection = () => {
  const initialMsg = {
    id: 1,
    createdAt: Date.now(),
    text: '**Hello!** *How can I help you today?*',
    ai: true
  }
  const [messages, setMessages] = useState([initialMsg]);

  /**
  * A function for adding a new message to the collection.
  *
  * @param {Object} message - The message to add to the collection.
  */
  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    saveToFirestore(message);
  }

  const clearMessages = () => setMessages([initialMsg])

  return [messages, addMessage, clearMessages];
}

export default useMessageCollection