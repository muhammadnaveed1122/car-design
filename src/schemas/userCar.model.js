import { userCarStatus } from '@/constants/data';
import { fa } from '@faker-js/faker';
import { DataTypes } from 'sequelize';

export { userCarsModel };

function userCarsModel(sequelize) {
    const attributes = {
        specs: { type: DataTypes.TEXT, allowNull: true },
        lot: { type: DataTypes.STRING, allowNull: true },
        vin: { type: DataTypes.STRING, allowNull: true },
        make: { type: DataTypes.STRING, allowNull: true },
        year: { type: DataTypes.INTEGER, allowNull: true },
        model: { type: DataTypes.STRING, allowNull: true },
        color: { type: DataTypes.STRING, allowNull: true },
        price: { type: DataTypes.INTEGER, allowNull: true },
        engine: { type: DataTypes.STRING, allowNull: true },
        doors: { type: DataTypes.INTEGER, allowNull: true },
        seats: { type: DataTypes.INTEGER, allowNull: true },
        fuelType: { type: DataTypes.STRING, allowNull: true },
        location: { type: DataTypes.STRING, allowNull: true },
        mileage: { type: DataTypes.INTEGER, allowNull: true },
        bodyStyle: { type: DataTypes.STRING, allowNull: true },
        driveType: { type: DataTypes.STRING, allowNull: true },
        bodyStyle: { type: DataTypes.STRING, allowNull: true },
        cylinders: { type: DataTypes.STRING, allowNull: true },
        carDataJson: { type: DataTypes.JSON, allowNull: true },
        companyName: { type: DataTypes.STRING, allowNull: true },
        transmission: { type: DataTypes.STRING, allowNull: true },
        slug: { type: DataTypes.STRING, allowNull: false, unique: true },
        pdf: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
        isTrash: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        isPending: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        interiorImages: { type: DataTypes.TEXT('long'), allowNull: false, defaultValue: '[]' },
        exteriorImages: { type: DataTypes.TEXT('long'), allowNull: false, defaultValue: '[]' },
        engineImages: { type: DataTypes.TEXT('long'), allowNull: false, defaultValue: '[]' },
        companyImage: { type: DataTypes.TEXT('long'), allowNull: true, defaultValue: '' },
        status: { type: DataTypes.ENUM(...userCarStatus), allowNull: false, defaultValue: userCarStatus[2] },
        phoneNumber: { type: DataTypes.STRING, allowNull: false },
        creator: { type: DataTypes.INTEGER, allowNull: false },
        vehicleType:{type:DataTypes.STRING, allowNull: true},
        driveSide:{type:DataTypes.STRING, allowNull: true}
    };

    const options = {
        defaultScope: {
            attributes: {}
        },
        scopes: {
        },
    };

    return sequelize.define('UserCar', attributes, options);
}
