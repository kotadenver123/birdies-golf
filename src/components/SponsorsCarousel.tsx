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
      <h3 className="text-xl font-semibold mb-4 text-white">League Sponsors</h3>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {sponsors.map((sponsor) => (
            <CarouselItem key={sponsor.id} className="basis-1/3 md:basis-1/4 lg:basis-1/5">
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
                    className="w-full h-24 object-contain bg-white rounded-lg p-2"
                  />
                </a>
              ) : (
                <img
                  src={sponsor.image_url}
                  alt={sponsor.name}
                  className="w-full h-24 object-contain bg-white rounded-lg p-2"
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-white" />
        <CarouselNext className="bg-white" />
      </Carousel>
    </div>
  );
};