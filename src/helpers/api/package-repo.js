import { db } from "./db";
export const packageRepo = {
    create,
    getPackageByUserId
}
async function create(packageData) {
    const existingPackage = await db.Package.findOne({ where: { userId: packageData.userId, status: 1 } })
    if (existingPackage) {
        packageData.remainingCount = packageData.remainingCount + existingPackage.remainingCount;
        await db.Package.update({ status: 0 },
            {
                where: {
                    userId: packageData.userId, // Specify the userId
                    status: 1, // Optionally, specify the current status if needed
                },
            })
    }
    const newPackage = new db.Package(packageData);
    await newPackage.save();
    return newPackage;
}
async function getPackageByUserId(userId) {
    return await db.Package.findOne({ where: { userId: userId, status: 1 } })

}