'use client'
import initialSkillsOptions from '@/app/data/data.json';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MultiSelect } from './components/multi-select/multi-select';
import { FormDataSchema } from './schemas/FormDataSchema';

export default function CVPage() {
  const form = useForm({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      contactInfo: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        phoneIsWhatsapp: true,
        linkedinUsername: '',
        hasLinkedin: false,
      },
      content: {
        sections: {
          'Sobre mim': ``,
          'Soft Skills': ``,
          'Diferenciais': ``,
        },
        experience: [],
        education: [],
        skills: {},
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

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob);
    setPdfPreviewUrl(url);
  }, [form]);

  const generatePdfWithAI = useCallback(async () => {
    setPdfPreviewUrl(null);

    const response = await fetch('/api/generateWithAI', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.getValues()),
    });

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob);
    setPdfPreviewUrl(url);
  }, [form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      generatePdf();
    });
    return () => subscription.unsubscribe();
  }, [form, generatePdf]);

  const handleDownload = useCallback(() => {
    if (pdfPreviewUrl) {
      const link = document.createElement('a');
      link.href = pdfPreviewUrl;
      link.download = 'cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [pdfPreviewUrl]);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWithAI = useCallback(async () => {
    setIsGenerating(true);
    await generatePdfWithAI();
    setIsGenerating(false);
  }, [generatePdfWithAI]);

  return (
    <div className="min-h-screen bg-[#0D0126] text-white p-6 flex flex-col md:flex-row">
      <Carousel className="w-full md:w-1/2 pl-0 md:pl-6 mt-6 md:mt-0 md:sticky md:top-0">
        <CarouselContent>
          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardHeader className='mt-8'>
                  <CardTitle>
                    <h1>
                      Seja Bem-Vindo(a) ao cv-dev
                    </h1>
                  </CardTitle>
                  <CardDescription className='mt-4'>
                    <p>
                      O cv-dev é uma ferramenta inovadora que permite criar currículos personalizados e profissionais de forma rápida e fácil. Com uma interface intuitiva e recursos avançados, você pode destacar suas habilidades, experiências e conquistas de maneira eficaz.
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-6">
                  <p>
                    Para começar, preencha as informações pessoais e profissionais nos campos abaixo. O preview do seu currículo será atualizado automaticamente à medida que você preenche os dados. Você pode adicionar experiências, habilidades e muito mais!
                  </p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardHeader className='mt-8'>
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
                            <FormLabel>Nome Completo:</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite seu nome completo"
                                onChange={(e) => form.setValue('contactInfo.fullName', e.target.value)}
                                value={form.getValues('contactInfo.fullName')}
                                className="w-full"
                                type="text"
                                autoComplete="off"
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
                <CardHeader className='mt-8'>
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
                <CardHeader className='mt-8'>
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
                <CardHeader className='mt-8'>
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
                      {Object.entries(initialSkillsOptions).map(([category, subcategories]) => (
                        <div key={category} className="mb-6">
                          <Accordion type="single" collapsible className='w-full'>
                            <AccordionItem value={category} className='w-full'>
                              <AccordionTrigger className='w-full'>
                                <div className="flex items-center justify-between w-full">
                                  <h3 className="text-xl font-semibold mb-2">{category}</h3>
                                  <span className="text-sm text-gray-400">{Object.values(subcategories).flat().length} tags</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
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
                                      defaultValue={form.getValues(`content.skills.${category}.${subcategory}`)}
                                      onValueChange={(selectedOptions) => {
                                        const selectedValues = selectedOptions.map(option => option.valueOf());
                                        form.setValue(`content.skills.${category}.${subcategory}`, selectedValues);
                                      }}
                                      onNewOption={(newOption) => {
                                        const newOptions = [...options, newOption];
                                        form.setValue(`content.skills.${category}.${subcategory}`, newOptions);
                                        form.setValue(`content.skills.${category}.${subcategory}`, newOptions);
                                      }}
                                      className="w-full"
                                      placeholder={`Selecione as tags ou adicione novas`}
                                      value={form.getValues(`content.skills.${category}.${subcategory}`)}
                                      title="As tags devem conter apenas letras e espaços."
                                    />
                                  </div>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      ))}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardHeader className='mt-8'>
                  <CardTitle>
                    <h1>
                      Experiência
                    </h1>
                  </CardTitle>
                  <CardDescription className='mt-4'>
                    <p>
                      Adicione suas experiências profissionais, incluindo cargos, empresas e datas. Isso ajudará os recrutadores a entenderem seu histórico profissional.
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-6">
                  <Form {...form}>
                    <form className='w-full flex flex-col gap-4'>
                      {form.watch('content.experience').map((experience, index) => (
                        <div key={index} className="mb-6">
                          <Accordion type="single" collapsible className='w-full'>
                            <AccordionItem value={`experience-${index}`} className='w-full'>
                              <AccordionTrigger className='w-full'>
                                <div className="flex items-center justify-between w-full">
                                  <h3 className="text-xl font-semibold mb-2">{experience.company || 'Experiência'}</h3>
                                  <span className="text-sm text-gray-400">{experience.title || 'Cargo'}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <FormField
                                  control={form.control}
                                  name={`content.experience.${index}.company`}
                                  render={() => (
                                    <FormItem className='mb-4'>
                                      <FormLabel>Empresa:</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Digite o nome da empresa"
                                          onChange={(e) => form.setValue(`content.experience.${index}.company`, e.target.value)}
                                          value={form.getValues(`content.experience.${index}.company`)}
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

                                <FormField
                                  control={form.control}
                                  name={`content.experience.${index}.title`}
                                  render={() => (
                                    <FormItem className='mb-4'>
                                      <FormLabel>Cargo:</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Digite seu cargo"
                                          onChange={(e) => form.setValue(`content.experience.${index}.title`, e.target.value)}
                                          value={form.getValues(`content.experience.${index}.title`)}
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

                                <div className="flex gap-4 mb-4">
                                  <div className="flex-1">
                                    <FormField
                                      control={form.control}
                                      name={`content.experience.${index}.startDate.month`}
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>Mês de Início:</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Mês de Início"
                                              onChange={(e) => form.setValue(`content.experience.${index}.startDate.month`, e.target.value)}
                                              value={form.getValues(`content.experience.${index}.startDate.month`)}
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
                                  </div>
                                  <div className="flex-1">
                                    <FormField
                                      control={form.control}
                                      name={`content.experience.${index}.startDate.year`}
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>Ano de Início:</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Ano de Início"
                                              onChange={(e) => form.setValue(`content.experience.${index}.startDate.year`, e.target.value)}
                                              value={form.getValues(`content.experience.${index}.startDate.year`)}
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
                                  </div>
                                </div>

                                <div className="flex gap-4 mb-4">
                                  <div className="flex-1">
                                    <FormField
                                      control={form.control}
                                      name={`content.experience.${index}.endDate.month`}
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>Mês de Término:</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Mês de Término"
                                              onChange={(e) => form.setValue(`content.experience.${index}.endDate.month`, e.target.value)}
                                              value={form.getValues(`content.experience.${index}.endDate.month`)}
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
                                  </div>
                                  <div className="flex-1">
                                    <FormField
                                      control={form.control}
                                      name={`content.experience.${index}.endDate.year`}
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>Ano de Término:</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Ano de Término"
                                              onChange={(e) => form.setValue(`content.experience.${index}.endDate.year`, e.target.value)}
                                              value={form.getValues(`content.experience.${index}.endDate.year`)}
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
                                  </div>
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`content.experience.${index}.description`}
                                  render={() => (
                                    <FormItem className='mb-4'>
                                      <FormLabel>Descrição:</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Digite a descrição da experiência"
                                          onChange={(e) => form.setValue(`content.experience.${index}.description`, e.target.value)}
                                          value={form.getValues(`content.experience.${index}.description`)}
                                          className="w-full"
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
                                  name={`content.experience.${index}.isCurrent`}
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 mb-4">
                                      <FormLabel>Experiência Atual:</FormLabel>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormItem>
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => {
                                    const updatedExperience = form.getValues('content.experience');
                                    updatedExperience.splice(index, 1);
                                    form.setValue('content.experience', updatedExperience);
                                  }}
                                >
                                  Remover Experiência
                                </Button>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      ))}
                      <Button
                        className='w-fit'
                        type="button"
                        onClick={() => {
                          const updatedExperience = form.getValues('content.experience');
                          updatedExperience.push({
                            company: '',
                            title: '',
                            startDate: { month: '', year: '' },
                            endDate: { month: '', year: '' },
                            description: '',
                            isCurrent: false,
                          });
                          form.setValue('content.experience', updatedExperience);
                        }}
                      >
                        Adicionar Experiência
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardHeader className='mt-8'>
                  <CardTitle>
                    <h1>
                      Educação
                    </h1>
                  </CardTitle>
                  <CardDescription className='mt-4'>
                    <p>
                      Adicione suas informações educacionais, incluindo cursos, instituições e datas. Isso ajudará os recrutadores a entenderem sua formação acadêmica.
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-6">
                  <Form {...form}>
                    <form className='w-full flex flex-col gap-4'>
                      {form.watch('content.education').map((education, index) => (
                        <div key={index} className="mb-6">
                          <Accordion type="single" collapsible className='w-full'>
                            <AccordionItem value={`education-${index}`} className='w-full'>
                              <AccordionTrigger className='w-full'>
                                <div className="flex items-center justify-between w-full">
                                  <h3 className="text-xl font-semibold mb-2">{education.institution || 'Educação'}</h3>
                                  <span className="text-sm text-gray-400">{education.degree || 'Curso'}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <FormField
                                  control={form.control}
                                  name={`content.education.${index}.institution`}
                                  render={() => (
                                    <FormItem className='mb-4'>
                                      <FormLabel>Instituição:</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Digite o nome da instituição"
                                          onChange={(e) => form.setValue(`content.education.${index}.institution`, e.target.value)}
                                          value={form.getValues(`content.education.${index}.institution`)}
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

                                <FormField
                                  control={form.control}
                                  name={`content.education.${index}.degree`}
                                  render={() => (
                                    <FormItem className='mb-4'>
                                      <FormLabel>Curso:</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Digite seu curso"
                                          onChange={(e) => form.setValue(`content.education.${index}.degree`, e.target.value)}
                                          value={form.getValues(`content.education.${index}.degree`)}
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

                                {/* Add start date */}
                                <div className="flex gap-4 mb-4">
                                  <div className="flex-1">
                                    <FormField
                                      control={form.control}
                                      name={`content.education.${index}.startDate.month`}
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>Mês de Início:</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Mês de Início"
                                              onChange={(e) => form.setValue(`content.education.${index}.startDate.month`, e.target.value)}
                                              value={form.getValues(`content.education.${index}.startDate.month`)}
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
                                  </div>
                                  <div className="flex-1">
                                    <FormField
                                      control={form.control}
                                      name={`content.education.${index}.startDate.year`}
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>Ano de Início:</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Ano de Início"
                                              onChange={(e) => form.setValue(`content.education.${index}.startDate.year`, e.target.value)}
                                              value={form.getValues(`content.education.${index}.startDate.year`)}
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
                                  </div>
                                </div>
                                {/* Add end date */}
                                <div className="flex gap-4 mb-4">
                                  <div className="flex-1">
                                    <FormField
                                      control={form.control}
                                      name={`content.education.${index}.endDate.month`}
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>Mês de Término:</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Mês de Término"
                                              onChange={(e) => form.setValue(`content.education.${index}.endDate.month`, e.target.value)}
                                              value={form.getValues(`content.education.${index}.endDate.month`)}
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
                                  </div>
                                  <div className="flex-1">
                                    <FormField
                                      control={form.control}
                                      name={`content.education.${index}.endDate.year`}
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>Ano de Término:</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Ano de Término"
                                              onChange={(e) => form.setValue(`content.education.${index}.endDate.year`, e.target.value)}
                                              value={form.getValues(`content.education.${index}.endDate.year`)}
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
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => {
                                    const updatedEducation = form.getValues('content.education');
                                    updatedEducation.splice(index, 1);
                                    form.setValue('content.education', updatedEducation);
                                  }}
                                >
                                  Remover Curso
                                </Button>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      ))}
                      <Button
                        className='w-fit'
                        type="button"
                        onClick={() => {
                          const updatedEducation = form.getValues('content.education');
                          updatedEducation.push({
                            institution: '',
                            degree: '',
                            startDate: { month: '', year: '' },
                            endDate: { month: '', year: '' },
                          });
                          form.setValue('content.education', updatedEducation);
                        }}
                      >
                        Adicionar Curso
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardHeader className='mt-8'>
                  <CardTitle>
                    <h1>
                      Soft Skills
                    </h1>
                  </CardTitle>
                  <CardDescription className='mt-4'>
                    <p>
                      Adicione suas soft skills, como comunicação, trabalho em equipe e liderança. Isso ajudará os recrutadores a entenderem suas habilidades interpessoais.
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-6">
                  <Form {...form}>
                    <form className='w-full flex flex-col gap-4'>
                      <FormField
                        control={form.control}
                        name="content.sections.Soft Skills"
                        render={() => (
                          <FormItem>
                            <FormLabel>Soft Skills:</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Escreva suas soft skills aqui"
                                onChange={(e) => form.setValue('content.sections.Soft Skills', e.target.value)}
                                value={form.getValues('content.sections.Soft Skills')}
                                className="w-full"
                                autoComplete="off"
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
                <CardHeader className='mt-8'>
                  <CardTitle>
                    <h1>
                      Diferenciais
                    </h1>
                  </CardTitle>
                  <CardDescription className='mt-4'>
                    <p>
                      Adicione seus diferenciais, como cursos, certificações e prêmios. Isso ajudará os recrutadores a entenderem o que o torna único.
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex p-6">
                  <Form {...form}>
                    <form className='w-full flex flex-col gap-4'>
                      <FormField
                        control={form.control}
                        name="content.sections.Diferenciais"
                        render={() => (
                          <FormItem>
                            <FormLabel>Diferenciais:</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Escreva seus diferenciais aqui"
                                onChange={(e) => form.setValue('content.sections.Diferenciais', e.target.value)}
                                value={form.getValues('content.sections.Diferenciais')}
                                className="w-full"
                                autoComplete="off"
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

          {
            form.watch('contactInfo.fullName') &&
            form.watch('contactInfo.title') &&
            form.watch('contactInfo.email') &&
            form.watch('contactInfo.phone') &&
            form.watch('content.sections.Sobre mim') &&
            form.watch('content.skills') &&
            form.watch('content.education') &&
            form.watch('content.experience') &&
            form.watch('content.sections.Soft Skills') &&
            form.watch('content.sections.Diferenciais') &&
            (
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardHeader className='mt-8'>
                      <CardTitle>
                        <h1>
                          Gerar com IA
                        </h1>
                      </CardTitle>
                      <CardDescription className='mt-4'>
                        <p>
                          Adicione aqui os detalhes da vaga que você está se candidatando. Isso ajudará a IA a gerar um currículo mais personalizado e relevante para você.
                        </p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex p-6">
                      <Form {...form}>
                        <form className='w-full flex flex-col gap-4'>
                          <FormField
                            control={form.control}
                            name="apiKey"
                            render={() => (
                              <FormItem>
                                <FormLabel>GoogleAI API KEY:</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Insira sua chave de API aqui"
                                    onChange={(e) => form.setValue('apiKey', e.target.value)}
                                    value={form.getValues('apiKey')}
                                    className="w-full"
                                    autoComplete="off"
                                    required
                                  />
                                </FormControl>
                                <FormMessage className='text-sm text-gray-500 mt-1'>
                                  Você pode obter sua chave de API <a href="https://aistudio.google.com/app/u/1/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">aqui</a>.
                                </FormMessage>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="jobDetails"
                            render={() => (
                              <FormItem>
                                <FormLabel>Detalhes da Vaga:</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Escreva os detalhes da vaga aqui"
                                    onChange={(e) => form.setValue('jobDetails', e.target.value)}
                                    value={form.getValues('jobDetails')}
                                    className="w-full"
                                    autoComplete="off"
                                    required
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            className='w-fit'
                            type="button"
                            onClick={handleGenerateWithAI}
                            disabled={!form.getValues('jobDetails')}
                          >
                            Gerar Currículo com IA
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            )
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {pdfPreviewUrl && (
        <div className="w-full md:w-1/2 pl-0 md:pl-6 mt-6 md:mt-0 h-[85vh] md:sticky md:top-0">
          <div className="mt-1 mb-4 flex justify-between items-center">
            <Button
              variant="secondary"
              className='w-fit'
              onClick={handleDownload}
              disabled={!pdfPreviewUrl}
            >
              Baixar Currículo
            </Button>
          </div>
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