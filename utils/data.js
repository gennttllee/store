import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: 'mark',
            email: 'kentwears@gmail.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true,
        },
        {
            name: 'harry',
            email: 'harry@gmail.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true,
        },
    ],
    products: [
        {
            name: 'Adora blue bag',
            slug: 'adora-blue-bag',
            category: 'bags',
            gender: 'female',
            description: 'Adora bag with glittery accessories',
            image: '/images/blue-bag.jpeg',
            price: 6000,
            countInStock: 7,
        },
        {
            name: 'Manny (Birkenstock slippers)',
            slug: "manny-slippers",
            category: 'slippers',
            gender: 'female',
            description: 'Manny (Birkenstock slippers)',
            image: '/images/brown-slip.jpeg',
            price: 6000,
            countInStock: 9,
        },
        {
            name: 'Belinda mini bag',
            slug: 'belinda-mini-bag',
            category: 'bags',
            gender: 'female',
            description: 'Belinda mini bag for every occasion',
            image: '/images/green-bag-one.jpeg',
            price: 8000,
            countInStock: 9,
        },
        {
            name: 'Ruka slippers',
            gender: 'female',
            slug: 'ruka-slippers',
            category: 'slippers',
            description: 'Ruka ladies pair',
            image: '/images/green-slip.jpeg',
            price: 5000,
            countInStock: 9,
        },
    ],
};

export default data;