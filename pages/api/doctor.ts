// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../src/services/firebase";

type Data = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  userType: string;
  address: string;
  photoURL: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  const response = await getDocs(
    query(collection(db, "Users"), orderBy("name", "asc"))
  );
  const data = response.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    email: doc.data().email,
    phoneNumber: doc.data().phoneNumber,
    userType: doc.data().userType,
    address: doc.data().address,
    photoURL: doc.data().photoURL,
  }));
  res.status(200).json(data);
}
