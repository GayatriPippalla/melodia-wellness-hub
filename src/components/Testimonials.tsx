import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

const testimonials = [
  {
    text: "Melodia Wellness transformed my approach to stress management. I feel more balanced and centered than I have in years.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Mitchell",
    role: "Yoga Instructor",
  },
  {
    text: "The personalized wellness plan helped me finally achieve consistent sleep and reduce my anxiety levels significantly.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "David Chen",
    role: "Software Engineer",
  },
  {
    text: "I was skeptical at first, but the holistic coaching approach truly changed my daily habits and overall wellbeing.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Amara Johnson",
    role: "Teacher",
  },
  {
    text: "The mindfulness techniques I learned here have become essential to my morning routine. Life-changing experience.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Marcus Rivera",
    role: "Entrepreneur",
  },
  {
    text: "After burnout, Melodia helped me rediscover joy in everyday moments. Their compassionate approach is unmatched.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Elena Petrov",
    role: "Healthcare Worker",
  },
  {
    text: "The wellness assessments gave me real clarity on what my body and mind needed. Highly recommend to anyone feeling stuck.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Priya Sharma",
    role: "Marketing Manager",
  },
  {
    text: "I've tried many wellness programs, but this one actually stuck. The ongoing support makes all the difference.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "James Okafor",
    role: "Fitness Coach",
  },
  {
    text: "My stress levels dropped dramatically within the first month. The breathing exercises alone were worth it.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Lisa Nguyen",
    role: "Accountant",
  },
  {
    text: "Finding Melodia was a turning point in my wellness journey. I finally feel in tune with my body and mind.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Robert Kline",
    role: "Retired Professor",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
            What our clients say
          </h2>
          <p className="text-muted-foreground mt-3 text-center max-w-xl">
            Real stories from people who transformed their wellness journey with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} duration={19} className="hidden md:block" />
          <TestimonialsColumn testimonials={thirdColumn} duration={17} className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
