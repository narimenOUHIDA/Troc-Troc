import { PostalCode } from "./models/index.js";

async function testPostalCode() {
    try {
        const location = await PostalCode.findOne({
            where: { postalCode: "69001" }
        });

        console.log("Résultat :", location?.toJSON() ?? null);

    } catch (error) {
        console.error("Erreur :", error.message);
    }
}

testPostalCode();