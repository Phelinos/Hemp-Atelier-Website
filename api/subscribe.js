import {
    createClient
} from "@supabase/supabase-js";


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    }
);


export default async function handler(
    request,
    response
) {

    /* Only allow POST requests */

    if (request.method !== "POST") {

        response.setHeader(
            "Allow",
            "POST"
        );

        return response.status(405).json({
            ok: false
        });

    }


    /* Optional same-site check */

    const allowedOrigin =
    process.env.SITE_ORIGIN;


    const requestOrigin =
    request.headers.origin;


    if (
        allowedOrigin &&
        requestOrigin &&
        requestOrigin !== allowedOrigin
    ) {

        return response.status(403).json({
            ok: false
        });

    }


    try {

        const {
            email,
            consent,
            company
        } = request.body || {};


        /* ---------------------------------------------
         *      Honeypot
         *
         *      A real visitor cannot see this field.
         *      Bots often fill every field they find.
         *      --------------------------------------------- */

        if (
            typeof company === "string" &&
            company.trim() !== ""
        ) {

            /* Pretend it succeeded.
             *        This gives bots no useful feedback. */

            return response.status(200).json({
                ok: true
            });

        }


        /* ---------------------------------------------
         *      Validation
         *      --------------------------------------------- */

        if (
            typeof email !== "string" ||
            email.length > 254 ||
            !isValidEmail(email) ||
            consent !== true
        ) {

            return response.status(400).json({
                ok: false,
                message: "Invalid subscription."
            });

        }


        const cleanEmail =
        email
        .trim()
        .toLowerCase();


        /* ---------------------------------------------
         *      Save email privately
         *      --------------------------------------------- */

        const {
            error
        } =
        await supabase
        .from("newsletter_subscribers")
        .upsert(
            {
                email: cleanEmail,
                consent: true,
                consented_at:
                new Date().toISOString(),
                source: "website"
            },
            {
                onConflict: "email",
                ignoreDuplicates: true
            }
        );


        if (error) {

            console.error(
                "Supabase subscription error:",
                error.message
            );


            return response.status(500).json({
                ok: false
            });

        }


        /* Important:
         *      We return only success.
         *      We NEVER return subscriber records. */

        return response.status(200).json({
            ok: true
        });


    } catch (error) {

        console.error(
            "Newsletter API error:",
            error
        );


        return response.status(400).json({
            ok: false
        });

    }

}


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
    );

}
