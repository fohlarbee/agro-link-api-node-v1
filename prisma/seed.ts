import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedRoles() {
    const defaultRoles = ["vendor", "customer", "admin"]
    try {
        for (const role of defaultRoles) {
            const dbRole = await prisma.role.findUnique({
                where: { name: role }
            });
            if (dbRole) return;
            await prisma.role.create({
                data: { name: role }
            });
        }
        console.info('[SEED] Roles created successfully.')
    } catch(error: any) {
        console.error('e', error.message);
    }
}

seedRoles();
