const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create Departments
  console.log('📁 Creating departments...');
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        id: 'd1',
        name: 'Engineering',
        description: 'Software engineering and development roles',
      },
    }),
    prisma.department.create({
      data: {
        id: 'd2',
        name: 'Product Design',
        description: 'UI/UX and product design roles',
      },
    }),
    prisma.department.create({
      data: {
        id: 'd3',
        name: 'Data Science',
        description: 'Data analysis and machine learning roles',
      },
    }),
    prisma.department.create({
      data: {
        id: 'd4',
        name: 'Marketing',
        description: 'Marketing and growth roles',
      },
    }),
    prisma.department.create({
      data: {
        id: 'd5',
        name: 'Sales',
        description: 'Sales and business development roles',
      },
    }),
  ]);
  console.log(`✅ Created ${departments.length} departments\n`);

  // Create sample questions for Engineering
  console.log('❓ Creating sample questions...');
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        id: '1',
        title: 'Explain React Hooks',
        description: 'What are React Hooks and why were they introduced? Provide examples.',
        answerType: 'essay',
        departmentId: 'd1',
        difficulty: 'intermediate',
        skillType: 'technical',
        tags: JSON.stringify(['react', 'frontend', 'javascript']),
        marks: 10,
        createdBy: 'admin',
      },
    }),
    prisma.question.create({
      data: {
        id: '2',
        title: 'What is closure in JavaScript?',
        description: 'Explain closure with a practical example.',
        answerType: 'essay',
        departmentId: 'd1',
        difficulty: 'intermediate',
        skillType: 'technical',
        tags: JSON.stringify(['javascript', 'fundamentals']),
        marks: 10,
        createdBy: 'admin',
      },
    }),
    prisma.question.create({
      data: {
        id: '3',
        title: 'Database Normalization',
        description: 'Explain the different normal forms in database design.',
        answerType: 'essay',
        departmentId: 'd1',
        difficulty: 'advanced',
        skillType: 'technical',
        tags: JSON.stringify(['database', 'sql']),
        marks: 10,
        createdBy: 'admin',
      },
    }),
    prisma.question.create({
      data: {
        id: '4',
        title: 'REST API Design',
        description: 'What are the best practices for designing RESTful APIs?',
        answerType: 'essay',
        departmentId: 'd1',
        difficulty: 'intermediate',
        skillType: 'technical',
        tags: JSON.stringify(['api', 'backend', 'rest']),
        marks: 10,
        createdBy: 'admin',
      },
    }),
    prisma.question.create({
      data: {
        id: '5',
        title: 'Binary Tree Traversal',
        description: 'Write a function to perform in-order traversal of a binary tree.',
        answerType: 'code_editor',
        departmentId: 'd1',
        difficulty: 'advanced',
        skillType: 'technical',
        tags: JSON.stringify(['algorithms', 'data-structures']),
        marks: 10,
        codeTemplate: 'function inOrderTraversal(root) {\n  // Your code here\n}',
        createdBy: 'admin',
      },
    }),
  ]);
  console.log(`✅ Created ${questions.length} questions\n`);

  // Create a sample campaign
  console.log('📋 Creating sample campaign...');
  const campaign = await prisma.campaign.create({
    data: {
      id: 'c1',
      name: 'Frontend Developer - Q1 2024',
      description: 'Interview campaign for frontend developer positions',
      departmentId: 'd1',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      durationPerCandidate: 60,
      status: 'active',
      questionSetIds: JSON.stringify(['1', '2', '4']),
      questionsPerCandidate: 3,
      isRandomized: false,
      passingScore: 70,
      passingCriteria: 'Candidates must score at least 70% to pass',
      totalCandidates: 0,
      completedCandidates: 0,
      averageScore: 0,
      createdBy: 'admin',
    },
  });
  console.log(`✅ Created campaign: ${campaign.name}\n`);

  // Create admin user
  console.log('👤 Creating admin user...');
  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      password: 'admin123', // In production, this should be hashed
    },
  });
  console.log(`✅ Created user: ${user.email}\n`);

  console.log('🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Departments: ${departments.length}`);
  console.log(`   - Questions: ${questions.length}`);
  console.log(`   - Campaigns: 1`);
  console.log(`   - Users: 1`);
  console.log('\n✅ You can now use the application!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

