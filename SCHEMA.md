(TGChat { id, title, type })
(TGUser { id })
(TGMessage { id, text })

(TGUser)-[:CREATED_MESSAGE { timestamp }]->(TGMessage)
(TGMessage)-[:MESSAGE_EDITED { timestamp }]->(TGMessage)
(TGMessage)-[:MENTIONED]->(User)
(TGUser)-[:REACTED_TO { timestamp, old_reaction, new_reaction }]->(TGMessage)
(TGMessage)-[:REPLIED]->(TGMessage)


(TGUser)-[:JOINED { timestamp }]->(TGChat)
(TGUser)-[:LEFT { timestamp }]->(TGChat)

## Actions

### Message

1. Create or update chat
2. Create or update user
3. Create message