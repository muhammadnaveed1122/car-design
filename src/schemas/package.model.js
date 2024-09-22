import { DataTypes } from 'sequelize';

export { packageModel };

function packageModel(sequelize) {
    const attributes = {
        packageName: { type: DataTypes.STRING, allowNull: false },
        carCount: { type: DataTypes.INTEGER, allowNull: false },
        remainingCount: { type: DataTypes.INTEGER, allowNull: false },
        price: { type: DataTypes.FLOAT, allowNull: false },
        userId: { type: DataTypes.STRING, allowNull: false },
        PaymentId: { type: DataTypes.STRING, allowNull: false },
        status: {type: DataTypes.BOOLEAN,defaultValue: true},
    };
    const options = {
        defaultScope: {
            attributes: {}
        },
        scopes: {
        },
        indexes: [
        ]
    };

    return sequelize.define('package', attributes, options);
}