import manifest from "@/lib/media-manifest.json";
import { Photo } from "./Photo";

const cases = [
  { key: "restaurant", title: "Restaurants and cafes", text: "Menu highlights, opening hours, location and a phone number on one page.", alt: "A chef plating a dish in a restaurant kitchen" },
  { key: "salon", title: "Salons and barbers", text: "Services, a price overview and how to book, ready to share on social media.", alt: "A hairstylist cutting a client's hair" },
  { key: "freelancer", title: "Freelancers", text: "A simple page that explains what you do and how to get in touch.", alt: "A freelancer working on a laptop at a desk" },
  { key: "consultant", title: "Consultants", text: "Your services, your approach and a contact section, in a clean layout.", alt: "A consultant meeting with a client" },
  { key: "shop", title: "Local shops", text: "Tell people what you sell, where you are and when you are open.", alt: "A shopkeeper standing behind shelves of homemade products" },
  { key: "coach", title: "Coaches and trainers", text: "Describe your programmes and let clients reach you in one click.", alt: "A personal trainer talking with a client in a gym" },
] as const;

export function UseCases() {
  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <article key={c.key} className="surface surface-hover overflow-hidden p-0 sm:p-0">
            <div className="aspect-[3/2] overflow-hidden">
              <Photo name={c.key} alt={c.alt} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.text}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Photos from Pexels by{" "}
        {cases.map((c, i) => (
          <span key={c.key}>
            <a href={manifest[c.key].url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">{manifest[c.key].photographer}</a>
            {i < cases.length - 1 ? ", " : ""}
          </span>
        ))}
        {[manifest["home-hero"], manifest["features-hero"]].map((h) => (
          <span key={h.url}>
            {", "}
            <a href={h.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">{h.photographer}</a>
          </span>
        ))}
        .
      </p>
    </div>
  );
}
