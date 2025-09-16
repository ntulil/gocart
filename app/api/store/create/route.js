import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// create the store
export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    // 
    const formData = await req.formData();
    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");
    const isPublic = formData.get("isPublic") === "true";

    if (!name || !username || !description || !email || !contact || !address) {
        return NextResponse.json({ error: "Missing required store fields" }, { status: 400 });

  }
//   Check if user has already registered a store

const store = await prisma.store.findFirst({
    where: {userId: userId,},
  });

//   If the store exists, return the status of the store
if (store) {
    return NextResponse.json({ status: store.status }, { status: 200 }  );
  }

  // check is username is already taken
    const isUsernameTaken = await prisma.store.findFirst({
        where: { username: username.toLowerCase() 
        }}
    )
    if (isUsernameTaken) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const res = await imagekit.upload({
        file: buffer,
        fileName: image.name,
        folder: "/logos",
    })

const optimizedImage = imagekit.url({
    path: res.filePath,
    transformation: [
        
            { quality: "auto" },
            { format: "webp" },
            { width: "512" },
        ]    
})

const newStore = await prisma.store.create({
    data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        email,
        contact,
        address,
        logo: optimizedImage,
    },
});
// Update the user with the store id / LINK Store to user
    await prisma.user.update({
        where: { id: userId },
        data: { store: { connect: {id: newStore.id }}}
    });

    return NextResponse.json({ message: "Application submitted successfully, waiting for approval" }, { status: 201 });


 } catch (error) {
    console.error("Error creating store:", error);
    return NextResponse.json({ error: error.code || error.message }, { status: 400 });
  }
}

// check if user has already registered a store, if yes then send status of store
export async function GET (req) {
    try {
        const { userId } = getAuth(req);

        const store = await prisma.store.findFirst({
            where: {userId: userId,},
        });

        //   If the store is already registered, return the status of the store
        if (store) {
            return NextResponse.json({ status: store.status }, { status: 200 }  );
        }
        return NextResponse.json({ status: "Not registered" });
        
    } catch (error) {
        console.error("Error creating store:", error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
        }
}