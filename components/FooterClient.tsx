"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import Parteners from "./Parteners";
import { FooterContent } from "@/types/footer";
import { usePathname, useSearchParams } from "next/navigation";
import EditableTextFooter from "./EditableTextFooter";

type Props = {
  content: FooterContent;
};

export function FooterClient({ content }: Props) {
  const footerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";

  const addEditModeParam = (href: string) => {
    return isEditMode ? `${href}?mode=edit` : href;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (footerRef.current) {
        const firstChild = footerRef.current.children[0] as HTMLElement;
        if (
          firstChild &&
          firstChild.children &&
          firstChild.children.length > 0
        ) {
          gsap.fromTo(
            Array.from(firstChild.children),
            { y: 60, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.4,
              stagger: 0.25,
              ease: "power2.out",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 90%",
              },
            }
          );
        }
      }
    });

    return () => ctx.revert();
  }, []);

  if (pathname.startsWith("/content") || pathname.startsWith("/auth")) {
    return <></>;
  }

  return (
    <div className="flex flex-col mt-auto">
      <Parteners />
      <footer
        ref={footerRef}
        className="px-4 py-10 mt-12 md:py-12 bg-[#BFA999D9]"
      >
        <div className="section-container mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-8 min-h-[200px]">
          <div className="space-y-6 md:space-y-5 text-[#141414]">
            <div>
              <EditableTextFooter
                initialValue={content.companyName || "Familie Sauter"}
                fieldName="companyName"
                isEditMode={isEditMode}
                className="font-bold mb-5 text-xl md:text-base"
                as="h3"
              />
              <EditableTextFooter
                initialValue={content.address1 || "Mühlerain 873"}
                fieldName="address1"
                isEditMode={isEditMode}
                className="mb-3 text-base md:text-base leading-relaxed"
                as="p"
              />
              <EditableTextFooter
                initialValue={content.address2 || "CH-9116 Wolfertswil SG"}
                fieldName="address2"
                isEditMode={isEditMode}
                className="mb-3 text-base md:text-base leading-relaxed"
                as="p"
              />
            </div>

            <div className="pt-3">
              <EditableTextFooter
                initialValue={content.phone || "079 770 49 24"}
                fieldName="phone"
                isEditMode={isEditMode}
                className="mb-3 text-base md:text-base font-medium"
                as="p"
              />
              <EditableTextFooter
                initialValue={content.email || "ti.genoveva@bluewin.ch"}
                fieldName="email"
                isEditMode={isEditMode}
                className="text-base md:text-base font-medium underline"
                as="a"
                href={`mailto:${content.email || "ti.genoveva@bluewin.ch"}`}
              />
            </div>
          </div>
          <div>
            <EditableTextFooter
              initialValue={content.linksHeading || "Links"}
              fieldName="linksHeading"
              isEditMode={isEditMode}
              className="font-bold text-[#141414] mb-5 text-sm"
              as="h3"
            />
            <ul className="space-y-4 md:space-y-3 text-sm">
              <li>
                <EditableTextFooter
                  initialValue={content.linkStart || "Start"}
                  fieldName="linkStart"
                  isEditMode={isEditMode}
                  className="hover:underline transition-all duration-300 block"
                  as="a"
                  href={addEditModeParam("/")}
                />
              </li>
              <li>
                <EditableTextFooter
                  initialValue={content.linkAbout || "Über uns"}
                  fieldName="linkAbout"
                  isEditMode={isEditMode}
                  className="hover:underline transition-all duration-300 block"
                  as="a"
                  href={addEditModeParam("/uber-uns")}
                />
              </li>
              <li>
                <EditableTextFooter
                  initialValue={content.linkNews || "News"}
                  fieldName="linkNews"
                  isEditMode={isEditMode}
                  className="hover:underline transition-all duration-300 block"
                  as="a"
                  href={addEditModeParam("/news")}
                />
              </li>
              <li>
                <EditableTextFooter
                  initialValue={content.linkBeauceron || "unsere Beauceron"}
                  fieldName="linkBeauceron"
                  isEditMode={isEditMode}
                  className="hover:underline transition-all duration-300 block"
                  as="a"
                  href={addEditModeParam("/unsere-rassezucht")}
                />
              </li>
              <li>
                <EditableTextFooter
                  initialValue={content.linkWurf || "Wuif"}
                  fieldName="linkWurf"
                  isEditMode={isEditMode}
                  className="hover:underline transition-all duration-300 block"
                  as="a"
                  href="#"
                />
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
