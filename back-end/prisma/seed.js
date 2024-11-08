const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.author.deleteMany({});
  await prisma.visitor.deleteMany({});

  // Create authors
  const author1 = await prisma.author.create({
    data: {
      username: 'johndoe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
    },
  });

  const author2 = await prisma.author.create({
    data: {
      username: 'janesmith',
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 10),
    },
  });

  // Create visitors
  const visitor1 = await prisma.visitor.create({
    data: {
      username: 'reader1',
      email: 'reader1@example.com',
    },
  });

  const visitor2 = await prisma.visitor.create({
    data: {
      username: 'reader2',
      email: 'reader2@example.com',
    },
  });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Node.js',
      content: 'Node.js is a powerful runtime that allows you to run JavaScript on the server. In this post, we\'ll explore the basics of Node.js and how to build your first application.',
      published: true,
      authorId: author1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Understanding React Hooks',
      content: 'React Hooks are a game-changer in how we write React components. This post covers useState, useEffect, and custom hooks with practical examples.',
      published: true,
      authorId: author1.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'PostgreSQL Best Practices',
      content: 'Learn about PostgreSQL optimization, indexing strategies, and query performance. This guide covers everything from basic to advanced topics.',
      published: false, // Draft post
      authorId: author2.id,
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'Great introduction to Node.js! Looking forward to more posts.',
      postId: post1.id,
      visitorId: visitor1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'This helped me understand hooks much better. Thanks!',
      postId: post2.id,
      visitorId: visitor2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Could you add more examples about error handling?',
      postId: post1.id,
      visitorId: visitor2.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 