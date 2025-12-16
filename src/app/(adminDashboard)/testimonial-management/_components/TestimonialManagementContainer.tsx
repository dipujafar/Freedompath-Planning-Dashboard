import review_client_1 from "@/assets/image/review_client1.png"
import review_client_2 from "@/assets/image/review_client2.png"
import TestimonialCard from "./TestimonialCard"
const reviewData = [
    {
        id: 1,
        name: "Jenny Wilson",
        comment: "We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.",
        image: review_client_1,
        org: "Grower.io",
        rating: 5
    },
    {
        id: 2,
        name: "Jenny Wilson",
        comment: "We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.",
        image: review_client_2,
        org: "DLDesign.co",
        rating: 5
    },
    {
        id: 3,
        name: "Jenny Wilson",
        comment: "We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.",
        image: review_client_1,
        org: "Grower.io",
        rating: 5
    },
    {
        id: 4,
        name: "Jenny Wilson",
        comment: "We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.",
        image: review_client_2,
        org: "DLDesign.co",
        rating: 5
    },
    {
        id: 5,
        name: "Jenny Wilson",
        comment: "We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.",
        image: review_client_2,
        org: "DLDesign.co",
        rating: 5
    },
    {
        id: 6,
        name: "Jenny Wilson",
        comment: "We love Landingfolio! Our designers were using it for their projects, so we already knew what kind of design they want.",
        image: review_client_1,
        org: "Grower.io",
        rating: 5
    },

]


export default function ClientReviewCarousel() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
                reviewData.map((review) => <div
                    key={review?.id}
                >
                    <TestimonialCard review={review} />
                </div>)
            }
        </div>
    )
}
