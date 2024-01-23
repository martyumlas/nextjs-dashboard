import { PrismaClient } from '@prisma/client'

const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');

import bcrypt from 'bcrypt'
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient()

async function seedUsers() {
  try {
    await Promise.all(
      users.map(async user  => {
        const hashedPassword =  await bcrypt.hash(user.password, 10)
        const hashedUser = {...user, password: hashedPassword}
  
        await prisma.users.upsert({
          where: {email: user.email},
          update: {},
          create: hashedUser
        })
      })
    )
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  } 
}


async function seedCustomers() {
  try {
    customers.map(async customer => {
      await prisma.customers.upsert({
        where: {id: customer.id},
        update: {},
        create: customer
      })
    })

  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}


async function seedInvoices() {
  try {
    await Promise.all(
      invoices.map(async invoice => {
        const updatedInvoice = {...invoice, id: uuidv4(), date: new Date(invoice.date).toISOString()}
        await prisma.invoices.upsert({
          where: {id : updatedInvoice.id},
          update: {},
          create: updatedInvoice
        })
      })
    )
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    await Promise.all(
      revenue.map(async rev => {
        await prisma.revenue.upsert({
          where: {month: rev.month},
          update: {},
          create: rev
        })
      })
    )
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  await seedUsers()
  await seedInvoices()
  await seedCustomers()
  await seedRevenue()
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })