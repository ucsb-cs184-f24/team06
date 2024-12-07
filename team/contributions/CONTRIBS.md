## Cappillen Lee

Worked on setting up the template screen for the Shop view. Implemented a design for the entire app. Started with the Authentication views and moved onto the main game view. Added a bunch of pixel art to build a sense of a video game in the design of the app. Helped write code to dynamically display plants sprites. Reorganized the layout of the garden view to compact features and make them accessible. Worked on a in-game purchase feature for unlocking garden plots.

## Samantha West

Implemented the early seed data structure before Firebase. Added shop system with purchasable items, randomized shop inventory refreshes based on rarity, and type-checking to allow only valid seeds. Made backend watering feature, enabling plants to reduce growth time, with updates to the Player class. Implemented growth tracking using timestamps to dynamically update plant stages and sprites, along with fixes to naming inconsistencies and the addition of many new plant types, including a predefined starting set. Adjusted seed prices to balance the in-game economy, and added unit tests to validate shop functionality.

## Sophia Tran

Created the inventory bar design and placement, with sample items as placeholders. Implemented functionality for the Friends page, including displaying friends in a neat list on the screen and allowing users to search and filter through a list of registered players and click to add them as friends. Added styling to the Friends page, by importing a pixel flower background, adding a white container to hold the text, and updating the fonts used throughout the page to match the global styles for the app. Additionally, updated the styling for the user & coins header which shows on every page.

## Grace Feng

Designed and implemented a player registry to manage player data, including functions for adding friends, managing accounts, and preparing for Firebase integration. Developed the free seed feature, allowing players to shake their device for a random seed every 5 hours. Implemented idle coin generation to ensure coins are produced based on plant growth, rarity, and player activity. Also created the popup component to display idle coins generated upon each login. Also improved the UI/UX by styling the Free Seed page, adding sprites, and refining user interactions. To ensure the project's functionality and scalability, I wrote unit tests for the GardenScreen component, mocked child components for isolated testing, and optimized the codebase by restructuring files and updating dependencies.

## Richard Fang

Implemented user authentication and management with Firebase. Created Firebase app and database and set up backend integration with Firebase. Created the currently used backend data structures for Plants, Seeds, and Plots (in types) and their respective functions (in managers). Implemented all CRUD operations to the plants, seeds, and plots to read and write from Firebase so user data is properly stored and loaded upon logging into the app. Implemented buying functionality in the shop to properly interact with user coins and inventory (checking and updating data in Firebase) and designed frontend modals for buying items and header to display user email and coin amount. Implemented deleting friends and trading functionality and designed frontend trading modals to select and request seeds for trading.

## Esme Puzio

Code: Created early versions of the plant data structure and garden plot data structure (without Firebase integration). Added interactions between the garden plot data structure and inventory data structure which varied based on the user’s currently selected item (seed, shovel or watering can). Added pixel art animations to the garden plot which played when the player interacted with a plot. Added Firebase CRUD functionality to the watering can and shovel tool. Created UI, frontend modals and added Firebase CRUD functionality for the “Pending Trades” element on the Friends page to let players accept or reject incoming seed trades. Assets: Created original pixel art animations for planting a seed, watering a seed and digging up a plant from a garden plot. Drew original pixel art for the player inventory background, player tools (watering can and shovel), seed packets (common, uncommon, rare, unique and legendary seeds), and garden plot sprites (dry, watered, locked).

## Elijah Frankle

Code: Created early data structures, structure for page navigation, bottom tab navigation, home screen naviation, transitions between pages, home screen animation, worked on integrating spirtes, improving formatting/graphics and loading issues. Assets: researched pixel assets, obtained plant sprite sheet, edited it into usable files. Discussion: led group discussion on high level features, created tracking documents in discord for group assignments.
