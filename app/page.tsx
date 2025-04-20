'use client'
import intialSkillsOptions from '@/app/data/data.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormDataSchema } from './schemas/FormDataSchema';
import { faker } from '@faker-js/faker';
import { Switch } from '@/components/ui/switch';

export default function CVPage() {
  const form = useForm({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      contactInfo: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        phoneIsWhatsapp: false,
        linkedinUsername: '',
        githubUsername: '',
        hasLinkedin: false,
        hasGithub: false,
      },
      content: {
        sections: {
          'Sobre mim': '',
          'Soft Skills': '',
          'Diferenciais': '',
        },
        experience: [],
        education: [],
        skills: intialSkillsOptions,
      },
    },
  });

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const generatePdf = useCallback(async () => {
    setPdfPreviewUrl(null);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.getValues()),
    });
    console.log('response', response);

    const blob = await response.blob()
    console.log('blob', blob);

    const url = window.URL.createObjectURL(blob);
    console.log('url', url);

    setPdfPreviewUrl(url);
  }, [form]);

  useEffect(() => {
    console.clear();
    const subscription = form.watch((value) => {
      console.log('Form values changed:', value);
      generatePdf();
    });
    return () => subscription.unsubscribe();
  }, [form, generatePdf]);

  return (
    <div className="min-h-screen bg-[#0D0126] text-white p-6 flex flex-col md:flex-row">
      <Carousel className="w-full md:w-1/2 pl-0 md:pl-6 mt-6 md:mt-0 h-[85vh] md:sticky md:top-0">
        <CarouselContent>
          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h1>
                      Informações Pessoais
                    </h1>
                  </CardTitle>
                  <CardDescription>
                    <p>
                      Preencha os campos abaixo para gerar seu currículo em PDF. O preview será atualizado automaticamente.
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-6">
                  <Form {...form}>
                    <form className='w-full flex flex-col gap-4'>
                      <FormField
                        control={form.control}
                        name="contactInfo.fullName"
                        render={() => (
                          <FormItem>
                            <FormLabel>Full Name:</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite seu nome completo"
                                onChange={(e) => form.setValue('contactInfo.fullName', e.target.value)}
                                value={form.getValues('contactInfo.fullName')}
                                className="w-full"
                                type="text"
                                autoComplete="off"
                                autoFocus
                                required
                                maxLength={50}
                                minLength={3}
                                pattern="^[a-zA-ZÀ-ÿ\s]+$"
                                title="O nome deve conter apenas letras e espaços."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactInfo.title"
                        render={() => (
                          <FormItem>
                            <FormLabel>Título:</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Desenvolvedor Frontend"
                                onChange={(e) => form.setValue('contactInfo.title', e.target.value)}
                                value={form.getValues('contactInfo.title')}
                                className="w-full"
                                type="text"
                                autoComplete="off"
                                required
                                maxLength={50}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactInfo.email"
                        render={() => (
                          <FormItem>
                            <FormLabel>Email:</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite seu email"
                                onChange={(e) => form.setValue('contactInfo.email', e.target.value)}
                                value={form.getValues('contactInfo.email')}
                                className="w-full"
                                type="email"
                                autoComplete="off"
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactInfo.phone"
                        render={() => (
                          <FormItem>
                            <FormLabel>Telefone:</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite DDI, DDD e número"
                                onChange={(e) => form.setValue('contactInfo.phone', e.target.value)}
                                value={form.getValues('contactInfo.phone')}
                                className="w-full"
                                type="tel"
                                autoComplete="off"
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactInfo.phoneIsWhatsapp"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormLabel>WhatsApp:</FormLabel>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactInfo.hasLinkedin"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormLabel>Possui LinkedIn:</FormLabel>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormItem>
                        )}
                      />
                      {form.watch('contactInfo.hasLinkedin') && (
                        <FormField
                          control={form.control}
                          name="contactInfo.linkedinUsername"
                          render={() => (
                            <FormItem>
                              <FormLabel>LinkedIn:</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Digite seu usuário do LinkedIn"
                                  onChange={(e) => form.setValue('contactInfo.linkedinUsername', e.target.value)}
                                  value={form.getValues('contactInfo.linkedinUsername')}
                                  className="w-full"
                                  type="text"
                                  autoComplete="off"
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="contactInfo.hasGithub"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormLabel>Possui GitHub:</FormLabel>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormItem>
                        )}
                      />
                      {form.watch('contactInfo.hasGithub') && (
                        <FormField
                          control={form.control}
                          name="contactInfo.githubUsername"
                          render={() => (
                            <FormItem>
                              <FormLabel>GitHub:</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Digite seu usuário do GitHub"
                                  onChange={(e) => form.setValue('contactInfo.githubUsername', e.target.value)}
                                  value={form.getValues('contactInfo.githubUsername')}
                                  className="w-full"
                                  type="text"
                                  autoComplete="off"
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {pdfPreviewUrl && (
        <div className="w-full md:w-1/2 pl-0 md:pl-6 mt-6 md:mt-0 h-[92vh] md:sticky md:top-0">
          <div className="border border-gray-300 rounded overflow-hidden h-full">
            <iframe
              src={pdfPreviewUrl}
              width="100%"
              height="100%"
              title="Preview do Currículo"
            />
          </div>
        </div>
      )}
    </div>
  );
}