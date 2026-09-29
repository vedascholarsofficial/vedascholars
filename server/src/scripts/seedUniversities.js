require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const University = require('../models/University');

const universities = [
    {
        name: 'Indian Institute of Technology, Delhi',
        location: 'New Delhi, India',
        description: 'One of India\'s premier technology institutions offering world-class engineering and management programs with a focus on innovation and research.',
        courses: [
            { name: 'B.Tech Computer Science', skillsRequired: ['java', 'python', 'data structures', 'algorithms'] },
            { name: 'B.Tech Electrical Engineering', skillsRequired: ['circuit design', 'matlab', 'embedded systems'] },
            { name: 'M.Tech Artificial Intelligence', skillsRequired: ['machine learning', 'python', 'deep learning', 'tensorflow'] },
            { name: 'MBA', skillsRequired: ['communication', 'management', 'leadership', 'finance'] }
        ]
    },
    {
        name: 'London School of Economics',
        location: 'London, United Kingdom',
        description: 'A world-renowned social science university in London, offering programs in economics, finance, law, and international affairs.',
        courses: [
            { name: 'BSc Economics', skillsRequired: ['econometrics', 'statistics', 'excel', 'research'] },
            { name: 'MSc Finance', skillsRequired: ['financial modeling', 'excel', 'python', 'risk management'] },
            { name: 'LLM Law', skillsRequired: ['legal research', 'communication', 'critical thinking'] },
            { name: 'MBA', skillsRequired: ['management', 'leadership', 'strategy', 'communication'] }
        ]
    },
    {
        name: 'University of Melbourne',
        location: 'Melbourne, Australia',
        description: 'A leading research-intensive university in Australia known for excellence in biomedical science, engineering, and business education.',
        courses: [
            { name: 'Bachelor of Software Engineering', skillsRequired: ['javascript', 'python', 'java', 'software design'] },
            { name: 'Master of Data Science', skillsRequired: ['python', 'machine learning', 'sql', 'statistics', 'data structures'] },
            { name: 'Bachelor of Commerce', skillsRequired: ['accounting', 'management', 'finance', 'communication'] },
            { name: 'Master of Biomedical Science', skillsRequired: ['biology', 'chemistry', 'research', 'lab techniques'] }
        ]
    },
    {
        name: 'National University of Singapore',
        location: 'Singapore',
        description: 'Asia\'s top-ranked university offering rigorous programs in computing, engineering, business, and social sciences with a strong industry connection.',
        courses: [
            { name: 'B.Comp Computer Science', skillsRequired: ['python', 'java', 'data structures', 'algorithms', 'machine learning'] },
            { name: 'B.Eng Electrical Engineering', skillsRequired: ['circuit design', 'signal processing', 'matlab', 'embedded systems'] },
            { name: 'BBA Business Analytics', skillsRequired: ['sql', 'excel', 'statistics', 'management', 'communication'] },
            { name: 'MSc Artificial Intelligence', skillsRequired: ['deep learning', 'python', 'tensorflow', 'computer vision', 'nlp'] }
        ]
    },
    {
        name: 'University of Toronto',
        location: 'Toronto, Canada',
        description: 'Canada\'s leading research university with internationally recognized programs in computer science, engineering, medicine, and the arts.',
        courses: [
            { name: 'Honours BSc Computer Science', skillsRequired: ['python', 'java', 'c++', 'data structures', 'algorithms'] },
            { name: 'BASc Engineering Science', skillsRequired: ['mathematics', 'circuit design', 'matlab', 'physics'] },
            { name: 'Master of Management', skillsRequired: ['management', 'leadership', 'finance', 'strategy', 'communication'] },
            { name: 'MSc Applied Data Science', skillsRequired: ['python', 'sql', 'machine learning', 'statistics', 'tableau'] }
        ]
    },
    {
        name: 'ESSEC Business School',
        location: 'Paris, France',
        description: 'A prestigious European business school renowned for its innovative management programs, luxury brand management, and global executive education.',
        courses: [
            { name: 'Grande Ecole Programme', skillsRequired: ['management', 'finance', 'communication', 'leadership', 'strategy'] },
            { name: 'MSc Data Science & Business Analytics', skillsRequired: ['python', 'sql', 'machine learning', 'statistics', 'excel'] },
            { name: 'MSc Marketing', skillsRequired: ['communication', 'marketing', 'social media', 'branding', 'strategy'] }
        ]
    },
    {
        name: 'Technical University of Munich',
        location: 'Munich, Germany',
        description: 'Germany\'s top technical university with globally recognised programs in engineering, computer science, and natural sciences.',
        courses: [
            { name: 'BSc Informatics', skillsRequired: ['java', 'python', 'algorithms', 'data structures', 'c++'] },
            { name: 'MSc Robotics, Cognition, Intelligence', skillsRequired: ['machine learning', 'ros', 'python', 'computer vision', 'control systems'] },
            { name: 'MSc Management and Technology', skillsRequired: ['management', 'strategy', 'engineering', 'leadership', 'finance'] }
        ]
    }
];

const seed = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in your .env file.');
        }

        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB successfully.\n');

        console.log('🗑️  Clearing existing University documents...');
        const deleted = await University.deleteMany({});
        console.log(`   Removed ${deleted.deletedCount} existing document(s).\n`);

        console.log('📥 Inserting sample university data...');
        const inserted = await University.insertMany(universities);
        console.log(`   ✅ Successfully inserted ${inserted.length} universities:\n`);

        inserted.forEach((uni, i) => {
            console.log(`   ${i + 1}. ${uni.name} (${uni.location}) — ${uni.courses.length} course(s)`);
        });

        console.log('\n🎉 University seed completed successfully!');
    } catch (error) {
        console.error('\n❌ Seed script failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB.');
        process.exit(0);
    }
};

seed();
