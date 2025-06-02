"use client";

import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";

export function FAQsSection() {
  return (
    <section id="faqs" className="py-20 bg-slate-900">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Everything you need to know about AutoDev
          </p>
        </div>

        <div className="max-w-[800px] mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-purple-800/30">
              <AccordionTrigger className="text-white hover:text-primary">How does the image-to-code feature work?</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Simply upload a screenshot or image of a website, and our AI will analyze the visual elements and generate the corresponding HTML, CSS, and JavaScript code. You can then edit, customize, and deploy the code directly from our platform.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-purple-800/30">
              <AccordionTrigger className="text-white hover:text-primary">Is AutoDev suitable for beginners?</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Absolutely! AutoDev is designed to be user-friendly for developers of all skill levels. Beginners can use the code generation features to learn and understand code structure, while experienced developers can leverage our tools to speed up their workflow.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border-purple-800/30">
              <AccordionTrigger className="text-white hover:text-primary">What programming languages are supported?</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                AutoDev currently supports JavaScript, HTML, CSS, Python, Java, C++, Ruby, and more. We&apos;re continuously expanding our language support based on user feedback and demands.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border-purple-800/30">
              <AccordionTrigger className="text-white hover:text-primary">Is there a free plan available?</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Yes, it is completely free to use AutoDev. As a beginner you can use the platform to learn and practice coding. We are planning to introduce premium features in the future, but the core functionalities will always remain free.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="border-purple-800/30">
              <AccordionTrigger className="text-white hover:text-primary">How secure is my code on AutoDev?</AccordionTrigger>
              <AccordionContent className="text-gray-300">
                Security is our top priority. All your code is encrypted both in transit and at rest. We use industry-standard security practices to ensure your intellectual property remains protected. Additionally, you retain full ownership of all code you create or generate on our platform.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}