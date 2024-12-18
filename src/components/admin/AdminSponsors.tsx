import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Sponsor {
  id: string;
  name: string;
  image_url: string;
  website_url: string | null;
}

export default function AdminSponsors() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let finalImageUrl = imageUrl;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      const { error } = await supabase
        .from("sponsors")
        .insert({
          name,
          image_url: finalImageUrl,
          website_url: websiteUrl || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sponsor added successfully",
      });

      setName("");
      setImageUrl("");
      setWebsiteUrl("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });

    } catch (error) {
      console.error("Error adding sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to add sponsor",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("sponsors")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sponsor deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["sponsors"] });

    } catch (error) {
      console.error("Error deleting sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to delete sponsor",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Sponsors</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <Input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or upload an image below"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <Input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Website URL (Optional)</label>
          <Input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>

        <Button type="submit">Add Sponsor</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="border rounded-lg p-4">
            <img
              src={sponsor.image_url}
              alt={sponsor.name}
              className="w-full h-32 object-contain mb-2"
            />
            <h3 className="font-semibold">{sponsor.name}</h3>
            {sponsor.website_url && (
              <a
                href={sponsor.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline block mb-2"
              >
                Visit Website
              </a>
            )}
            <Button
              variant="destructive"
              onClick={() => handleDelete(sponsor.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}