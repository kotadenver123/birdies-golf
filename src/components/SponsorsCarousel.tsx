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
        .order("created_at");
      if (error) throw error;
      return data as Sponsor[];
    },
  });

  if (isLoading) return <div>Loading sponsors...</div>;
  if (!sponsors.length) return null;

  // Helper function to ensure image URL is absolute
  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url.substring(1);
    return url;
  };

  return (
    <div className="relative py-2">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full max-w-[95vw] mx-auto"
      >
        <CarouselContent>
          {sponsors.map((sponsor) => (
            <CarouselItem key={sponsor.id} className="basis-full">
              <div className="text-center p-1">
                {sponsor.website_url ? (
                  <a
                    href={sponsor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={getImageUrl(sponsor.image_url)}
                      alt={sponsor.name}
                      className="w-full h-[60vh] object-contain bg-white rounded-lg p-4 mx-auto shadow-sm hover:shadow-md transition-shadow duration-200"
                    />
                  </a>
                ) : (
                  <img
                    src={getImageUrl(sponsor.image_url)}
                    alt={sponsor.name}
                    className="w-full h-[60vh] object-contain bg-white rounded-lg p-4 mx-auto shadow-sm"
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