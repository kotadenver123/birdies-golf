import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Sponsor {
  id: string;
  name: string;
  image_url: string;
  website_url: string | null;
}

export const SponsorsCarousel = () => {
  const { data: sponsors = [], isLoading } = useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Sponsor[];
    },
  });

  if (isLoading) return null;
  if (sponsors.length === 0) return null;

  return (
    <div className="w-full py-4">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent>
          {sponsors.map((sponsor) => (
            <CarouselItem key={sponsor.id} className="md:basis-1/2 lg:basis-1/2">
              <div className="text-center p-2">
                <h3 className="text-lg font-semibold mb-3 text-golf-text">{sponsor.name}</h3>
                {sponsor.website_url ? (
                  <a
                    href={sponsor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={sponsor.image_url}
                      alt={sponsor.name}
                      className="w-full h-60 md:h-80 object-contain bg-white rounded-lg p-4 mx-auto shadow-sm hover:shadow-md transition-shadow duration-200"
                    />
                  </a>
                ) : (
                  <img
                    src={sponsor.image_url}
                    alt={sponsor.name}
                    className="w-full h-60 md:h-80 object-contain bg-white rounded-lg p-4 mx-auto shadow-sm"
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-white -left-4 md:-left-6" />
        <CarouselNext className="bg-white -right-4 md:-right-6" />
      </Carousel>
    </div>
  );
};