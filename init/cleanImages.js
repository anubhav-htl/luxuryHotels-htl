import { MongoClient } from 'mongodb';
import chalk from 'chalk';

async function cleanUpBlankImages() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('luxuryhotelsmagazines-dev');
        const Hotel = db.collection('hotels');
        
        const cursor = Hotel.find({
            $or: Array.from({ length: 10 }, (_, i) => ({[`images[${i}]`]: '' }))
        });

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            const updatedImages = {};

            let newIndex = 0;
            for (let i = 0; i < 9; i++) {
                const field = `images[${i}]`;
                if (doc[field] && doc[field] !== '') {
                    updatedImages[`images[${newIndex}]`] = doc[field];
                    newIndex++;
                }
            }

            if (Object.keys(updatedImages).length > 0) {
                await Hotel.updateOne(
                    { _id: doc._id }, 
                    { $set: updatedImages }
                );
            }
        }
        
        console.log(chalk.green('Clean up completed successfully.'));
    } catch (error) {
        console.error(chalk.red('Error during clean up:', error));
    }    
}

cleanUpBlankImages();