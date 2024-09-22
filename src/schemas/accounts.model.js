import { DataTypes } from 'sequelize';

export { accountModel };

function accountModel(sequelize) {
    const attributes = {
        bankName: { type: DataTypes.STRING, allowNull: false },
        accountTitle: { type: DataTypes.STRING, allowNull: false },
        accountNumber: { type: DataTypes.STRING, allowNull: false },
        routingNumber: { type: DataTypes.STRING, allowNull: false },
        isActive: { type: DataTypes.BOOLEAN, allowNull: false }
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

    return sequelize.define('Account', attributes, options);
}