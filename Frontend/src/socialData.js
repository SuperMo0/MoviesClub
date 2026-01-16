export const USERS = [
    {
        id: "u1",
        name: "Sarah Jenkins",
        handle: "@sarah_movies",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        bio: "Cinema addict 🍿 | Sci-Fi lover",
        isVerified: true
    },
    {
        id: "u2",
        name: "Mike Ross",
        handle: "@mike_critic",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        bio: "Honest reviews only.",
        isVerified: false
    },
    {
        id: "u3",
        name: "Emily Blunt",
        handle: "@emily_b",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
        bio: "Just here for the popcorn.",
        isVerified: false
    },
    {
        id: "u4",
        name: "David Chen",
        handle: "@dave_directs",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        bio: "Filmmaker & Editor 🎥",
        isVerified: true
    }
];

export const REVIEWS = [
    {
        id: "p1",
        user: USERS[0], // Sarah
        movieTitle: "Inception",
        content: "Just watched Inception again for the 10th time. Still blows my mind how Nolan handled the dream layers. Does anyone else think the top definitely fell at the end? 🌀 #Nolan #Masterpiece",
        rating: 5, // out of 5
        image: "https://image.tmdb.org/t/p/original/hHXveNjanXhvKYqjhoPJCYkWubw.jpg", // Movie still
        likes: 1240,
        comments: [
            { id: "c1", user: USERS[1], text: "It definitely wobbled! He's awake." },
            { id: "c2", user: USERS[2], text: "I'm still confused to be honest 😂" }
        ],
        timestamp: "2h ago"
    },
    {
        id: "p2",
        user: USERS[1], // Mike
        movieTitle: "Madame Web",
        content: "I want my 2 hours back. The editing was choppy, the villain had zero depth, and the dialogue felt AI-generated. Avoid at all costs unless you like bad movies ironically. 📉",
        rating: 1.5,
        image: null, // Text-only review
        likes: 89,
        comments: [],
        timestamp: "5h ago"
    },
    {
        id: "p3",
        user: USERS[3], // David
        movieTitle: "Dune: Part Two",
        content: "The cinematography in Dune 2 is generational. Greig Fraser is a genius. The use of infrared cameras for the Giedi Prime scenes was a bold artistic choice that paid off perfectly. Visual storytelling at its peak.",
        rating: 5,
        image: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        likes: 3421,
        comments: [
            { id: "c3", user: USERS[0], text: "That arena scene was terrifying and beautiful." }
        ],
        timestamp: "1d ago"
    },
    {
        id: "p4",
        user: USERS[2], // Emily
        movieTitle: "Barbie",
        content: "Honestly just a fun time! Ryan Gosling stole the show. 'I am Kenough' hoodie ordered immediately. 💖",
        rating: 4,
        image: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xf8gc2484GyOTnz.jpg",
        likes: 850,
        comments: [
            { id: "c4", user: USERS[3], text: "The set design was incredible." }
        ],
        timestamp: "2d ago"
    },
    {
        id: "p5",
        user: USERS[1], // Mike
        movieTitle: "Argylle",
        content: "It was... okay? Fun action but the twists got exhausting after the 4th one. Henry Cavill's haircut is the real villain here.",
        rating: 2.5,
        image: null,
        likes: 45,
        comments: [],
        timestamp: "3d ago"
    }
];