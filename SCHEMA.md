(Chat { id, title, type })
(User { id })
(Message { id, text })

(User)-[:CREATED_MESSAGE { timestamp }]->(Message)
(Message)-[:UPDATED_TO { timestamp }]->(Message)
(Message)-[:MENTIONED]->(User)
(User)-[:REACTED_TO { timestamp, old_reaction, new_reaction }]->(Message)
(Message)-[:REPLY_TO]->(Message)


(User)-[:JOINED { timestamp }]->(Chat)
(User)-[:LEFT { timestamp }]->(Chat)