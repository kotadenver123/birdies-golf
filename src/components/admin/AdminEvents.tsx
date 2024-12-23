import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSeasons } from "@/hooks/useSeasons";
import EventForm from "./forms/EventForm";
import { format } from "date-fns";

export default function AdminEvents() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: seasons } = useSeasons();

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", selectedSeasonId],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*, seasons(title)")
        .order("event_date", { ascending: false });

      if (selectedSeasonId) {
        query = query.eq("season_id", selectedSeasonId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Event deleted successfully",
    });
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Events</h2>
          <Button onClick={() => setIsDialogOpen(true)}>Add Event</Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by Season:</span>
          <Select value={selectedSeasonId} onValueChange={setSelectedSeasonId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Seasons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Seasons</SelectItem>
              {seasons?.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Season</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events?.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.seasons?.title}</TableCell>
              <TableCell>{format(new Date(event.event_date), "PPP")}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.status}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(event)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Create Event"}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={selectedEvent}
            onSuccess={handleSuccess}
            onCancel={() => {
              setIsDialogOpen(false);
              setSelectedEvent(null);
            }}
            defaultSeasonId={selectedSeasonId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}