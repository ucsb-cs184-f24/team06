## The Final Standup

# Cap
Complete: 
- Discussed how we need to deploy the final app with Professor Hollerer, confirmed that Expo QR code is fine

# Sophia
Complete: 
- Removed all console.logs, kept all console.warnings
- Resolved bug caused by searching for users when a user email registered to Firebase is undefined

# Sam
Complete: 
- Renamed and added plants to plant list
- Updated how much seeds cost in the shop (based on rarity)
- Fixed bug with plant stacking where plant stacking UI element would show plant ID instead of numSeeds (how many seeds were stacked).

# Elijah
Complete: 
- Reformatted inventory bar UI so that plant name, seed packet sprite and number of plants in the stack are contained within a single UI element
- Downsized large images to improve loading time
- Added green transition to all screens upon first login so that users do not see unloaded images

# Esme
Complete:
- Edited watering function so that watering a plant reduces its growth time by a factor dependent on plant rarity/maxWater
- Ensured that users could not reduce a plant's growth time by watering it for a certain timeout period - this is supported by a "watered plot" visual cue
- Added two more plant types and updated names and rarities of plants (tropical tree and cacti retain more water than other plants)

# Richard
- Fixed Free Seed feature so that each user has their own timer to track how long until they can shake for their next free seed
