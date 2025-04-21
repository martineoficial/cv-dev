'use client'
import intialSkillsOptions from '@/app/data/data.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormDataSchema } from './schemas/FormDataSchema';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from './components/multi-select/multi-select';

export default function CVPage() {
  const form = useForm({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      contactInfo: {
        fullName: 'Diana Martine Blyza Pontes',
        title: 'Analista de engenharia de software',
        email: 'diana_martine@outlook.com',
        phone: '+5581999934299',
        phoneIsWhatsapp: true,
        linkedinUsername: 'martineoficial',
        githubUsername: 'martineoficial',
        hasLinkedin: true,
        hasGithub: true,
      },
      content: {
        sections: {
          'Sobre mim': `Analista de Engenharia de Software e especializada com desenvolvimento em front end, a minha atuação na Elo Serviços S.A., me permitiu colaborar com a manutenção do Elo Design System, que constitui manter a consistencia em design nos projetos, sites, páginas e demais produtos da empresa, buscando uma melhor experiência para o usuário final, o que impulsionou o êxito no processo de rebranding da marca. Com conhecimentos em backend e dados, atuei como engenheira de software nas squads responsáveis pelo cadastro e manutenção dos usuários dos portais da companhia, tanto em B2B como em B2C, dando manutenção a banco de dados, projetos e repositórios e resolução de chamados pertinente às necessidades dos clientes.

A minha estratégia consiste em qualidade na entrega e comprometimento com o produto, promovendo entregas acompanhadas de bateria de testes unitários e de ponta a ponta, documentação, previsibilidade e priorização de performance SEO. Na Accenture, atuei documentando projetos em backend com Java, e implementando interfaces de usuário nas aplicações web.`,
          'Soft Skills': `Soft Skills
- Resolução de Problemas e Pensamento Crítico
- Trabalho em Equipe e Comunicação
- Aprendizado Contínuo e Adaptabilidade
- Foco no Produto e Experiência do Usuário
`,
          'Diferenciais': `Diferenciais
- Conhecimento em Arquitetura de Software e Segurança (OWASP, CSRF)
- Experiência Full Stack e boas práticas de desenvolvimento
- Inglês B2 (leitura, escrita e comunicação técnica)`,
        },
        experience: [],
        education: [{
          degree: `Tecnólogo em Análise e Desenvolvimento de Sistemas`,
          institution: `UNINABUCO`,
          startDate: {
            month: `12`,
            year: `2020`
          },
          endDate: {
            month: `12`,
            year: `2024`
          }
        }],
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
      <Carousel className="w-full md:w-1/2 pl-0 md:pl-6 mt-6 md:mt-0 md:sticky md:top-0">
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
                  <CardDescription className='mt-4'>
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
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h1>
                      Informações de Contato
                    </h1>
                  </CardTitle>
                  <CardDescription className='mt-4'>
                    <p>
                      Adicione suas informações de contato, como email, telefone e redes sociais. Isso ajudará os recrutadores a entrarem em contato com você.
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-6">
                  <Form {...form}>
                    <form className='w-full flex flex-col gap-4'>
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

          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h1>
                      Resumo
                    </h1>
                  </CardTitle>
                  <CardDescription className='mt-4'>
                    <p>
                      Escreva um resumo sobre você, suas experiências e habilidades. O resumo deve ser breve e impactante.
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-6">
                  <Form {...form}>
                    <form className='w-full flex flex-col gap-4'>
                      <FormField
                        control={form.control}
                        name="content.sections.Sobre mim"
                        render={() => (
                          <FormItem>
                            <FormLabel>Sobre mim:</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Escreva o seu resumo aqui"
                                onChange={(e) => form.setValue('content.sections.Sobre mim', e.target.value)}
                                value={form.getValues('content.sections.Sobre mim')}
                                className="w-full"
                                autoComplete="off"
                                autoFocus
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h1>
                      Habilidades Técnicas
                    </h1>
                  </CardTitle>
                  <CardDescription className='mt-4'>
                    <p>
                      Adicione suas habilidades técnicas, como linguagens de programação, frameworks e ferramentas. Isso ajudará os recrutadores a entenderem suas competências técnicas.
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-6">
                  <Form {...form}>
                    <form className='w-full flex flex-col gap-4'>

                      {Object.entries(intialSkillsOptions).map(([category, subcategories]) => (
                        <div key={category} className="mb-6">
                          <h3 className="text-xl font-semibold mb-2">{category}</h3>
                          {Object.entries(subcategories).map(([subcategory, options]) => (
                            <div key={subcategory} className="mb-3">
                              <label className="block mb-1 font-medium italic">{subcategory}</label>
                              <MultiSelect
                                options={
                                  options.map(option => ({
                                    value: option,
                                    label: option,
                                  }))
                                }
                              />
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* <FormField
                        control={form.control}
                        name="content.skills"
                        render={() => (
                          <FormItem>
                            <FormLabel>Sobre mim:</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Escreva o seu resumo aqui"
                                onChange={(e) => form.setValue('content.sections.Sobre mim', e.target.value)}
                                value={form.getValues('content.sections.Sobre mim')}
                                className="w-full"
                                autoComplete="off"
                                autoFocus
                                required
                               />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}

                      {/* <div className="mb-4">
             <h2 className="text-2xl text-[#FF66C4] font-bold mb-2">Habilidades Técnicas</h2>
             {Object.entries(skillsOptions).map(([category, subcategories]) => (
               <div key={category} className="mb-6">
                 <h3 className="text-xl font-semibold mb-2">{category}</h3>
                 {Object.entries(subcategories).map(([subcategory, options]) => (
                   <div key={subcategory} className="mb-3">
                     <label className="block mb-1 font-medium italic">{subcategory}</label>
                     <MultiSelect
                       options={
                         options.map(option => ({
                           value: option,
                           label: option,
                         }))
                       }
                       defaultValue={formData.skills[category]?.[subcategory]}
                       onValueChange={(selectedOptions) => {
                         const selectedValues = selectedOptions.map(option => option.valueOf());
                         handleSkillChange(category, subcategory, selectedValues);
                       }}
                       onNewOption={(newOption) => {
                         handleNewSkill(category, subcategory, newOption);
                       }}
                     />
                   </div>
                 ))}
               </div>
             ))}
           </div> */}

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