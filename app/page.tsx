'use client'
import { useState, useEffect, useCallback } from 'react';
import skillsOptions from '@/app/data/data.json';

export default function CVPage() {
  interface Experience {
    company: string;
    title: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string } | 'Atual';
    description: string;
    isCurrent?: boolean;
  }

  interface Education {
    institution: string;
    degree: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string } | 'Atual';
    description?: string;
  }

  interface FormData {
    name: string;
    title: string;
    email: string;
    phone: string;
    phoneIsWhatsapp: boolean;
    linkedinUsername: string;
    githubUsername: string;
    hasLinkedin: boolean;
    hasGithub: boolean;
    sections: {
      'Sobre mim': string;
      'Soft Skills': string;
      'Diferenciais': string;
    };
    experience: Experience[];
    education: Education[];
    skills: {
      [category: string]: {
        [subcategory: string]: string[];
      };
    };
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    title: '',
    email: '',
    phone: '',
    phoneIsWhatsapp: false,
    linkedinUsername: '',
    githubUsername: '',
    hasLinkedin: false,
    hasGithub: false,
    sections: {
      'Sobre mim': ``,
      'Soft Skills': ``,
      'Diferenciais': ``,
    },
    experience: [
      {
        company: '',
        title: '',
        startDate: { month: '', year: '' },
        endDate: { month: '', year: '' },
        description: ``,
        isCurrent: false,
      }
    ],
    education: [
      {
        institution: '',
        degree: '',
        startDate: { month: '', year: '' },
        endDate: { month: '', year: '' },
        description: ''
      }
    ],
    skills: Object.fromEntries(
      Object.entries(skillsOptions).map(([category, subcategories]) => [
        category,
        Object.fromEntries(Object.keys(subcategories).map(sub => [sub, []]))
      ])
    ) as FormData['skills'],
  });
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => {
      if (type === 'checkbox') {
        return { ...prev, [name]: checked };
      } else if (name in prev.sections) {
        return { ...prev, sections: { ...prev.sections, [name]: value } };
      } else {
        return { ...prev, [name]: value };
      }
    });
  }

  const handleSkillCheckboxChange = (category: string, subcategory: string, skill: string) => {
    setFormData(prev => {
      const currentSkills = prev.skills[category][subcategory] || [];
      const updatedSkills = currentSkills.includes(skill)
        ? currentSkills.filter(s => s !== skill)
        : [...currentSkills, skill];
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: { ...prev.skills[category], [subcategory]: updatedSkills },
        },
      };
    });
  }

  const handleExperienceChange = (index: number, field: keyof Experience, value: string | { month: string; year: string } | 'Atual' | boolean) => {
    setFormData(prev => {
      const newExperience = [...prev.experience];
      if (field === 'isCurrent' && typeof value === 'boolean') {
        newExperience[index].isCurrent = value;
        if (value) {
          newExperience[index].endDate = 'Atual';
        } else if (newExperience[index].endDate === 'Atual') {
          newExperience[index].endDate = { month: '', year: '' };
        }
      } else {
        (newExperience[index][field] as typeof value) = value;
      }
      return { ...prev, experience: newExperience };
    });
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        title: '',
        startDate: { month: '', year: '' },
        endDate: { month: '', year: '' },
        description: '',
        isCurrent: false,
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string | { month: string; year: string } | 'Atual' | undefined) => {
    setFormData(prev => {
      const newEducation = [...prev.education];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newEducation[index][field] = value as any; // Type assertion
      return { ...prev, education: newEducation };
    });
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        startDate: { month: '', year: '' },
        endDate: { month: '', year: '' },
        description: ''
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const generatePdf = useCallback(async () => {
    setPdfPreviewUrl(null);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    console.log('url', url);
    setPdfPreviewUrl(url);
  }, [formData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generatePdf();
    }, 500); // 500ms de delay após a última mudança

    return () => clearTimeout(timeoutId); // Limpa o timeout se o componente for desmontado ou formData mudar antes do timeout
  }, [formData, generatePdf]);

  const handleDownload = () => {
    if (pdfPreviewUrl) {
      const link = document.createElement('a');
      link.href = pdfPreviewUrl;
      link.download = 'curriculo.pdf';
      link.click();
    }
  };

  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => String(2000 + i)).reverse();

  return (
    <div className="min-h-screen bg-[#0D0126] text-white p-6 flex flex-col md:flex-row">
      <div className="max-w-2xl w-full md:w-1/2 pr-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-[#FF66C4] mb-6">cv.dev</h1>
        <h2 className="text-2xl text-[#FF66C4] font-bold mb-4">Instruções</h2>
        <p className="mb-4">Preencha os campos abaixo para gerar seu currículo em PDF. O preview será atualizado automaticamente.</p>

        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-2xl text-[#FF66C4] font-bold mb-2 md:col-span-2">Informações Pessoais</h2>
          <input name="name" placeholder="Nome" className="p-2 rounded bg-[#1A1038] text-white" onChange={handleChange} value={formData.name} />
          <input name="title" placeholder="Título Profissional" className="p-2 rounded bg-[#1A1038] text-white" onChange={handleChange} value={formData.title} />
          <input name="email" placeholder="Email" className="p-2 rounded bg-[#1A1038] text-white" onChange={handleChange} value={formData.email} />
          <input name="phone" placeholder="Telefone: +99 99 99999-9999" pattern="^\+55 \d{2} \d{5}-\d{4}$" title="Formato: +55 81 99993-4299" className="p-2 rounded bg-[#1A1038] text-white" onChange={handleChange} value={formData.phone} />
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="phoneIsWhatsapp" checked={formData.phoneIsWhatsapp} onChange={handleChange} className="accent-[#FF66C4]" />
            <span>Número é WhatsApp</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" name="hasLinkedin" checked={formData.hasLinkedin} onChange={handleChange} className="accent-[#FF66C4]" />
            <span>Possui LinkedIn</span>
          </label>
          {formData.hasLinkedin && (
            <input name="linkedinUsername" placeholder="LinkedIn Username" className="p-2 rounded bg-[#1A1038] text-white" onChange={handleChange} value={formData.linkedinUsername} />
          )}

          <label className="flex items-center space-x-2">
            <input type="checkbox" name="hasGithub" checked={formData.hasGithub} onChange={handleChange} className="accent-[#FF66C4]" />
            <span>Possui GitHub</span>
          </label>
          {formData.hasGithub && (
            <input name="githubUsername" placeholder="GitHub Username" className="p-2 rounded bg-[#1A1038] text-white" onChange={handleChange} value={formData.githubUsername} />
          )}
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="mb-4">
            <label className="block mb-1 text-[#FF66C4] font-bold">Sobre mim</label>
            <textarea name="Sobre mim" rows={4} className="w-full p-2 rounded bg-[#1A1038] text-white" onChange={handleChange} value={formData.sections['Sobre mim']} />
          </div>

          <div className="mb-4">
            <h2 className="text-2xl text-[#FF66C4] font-bold mb-2">Habilidades Técnicas</h2>
            {Object.entries(skillsOptions).map(([category, subcategories]) => (
              <div key={category} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                {Object.entries(subcategories).map(([subcategory, options]) => (
                  <div key={subcategory} className="mb-3">
                    <label className="block mb-1 font-medium italic">{subcategory}</label>
                    <div className="flex flex-wrap gap-2">
                      {options.map(option => (
                        <label key={option} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={option}
                            checked={formData.skills[category]?.[subcategory]?.includes(option)}
                            onChange={() => handleSkillCheckboxChange(category, subcategory, option)}
                            className="accent-[#FF66C4]"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h2 className="text-2xl text-[#FF66C4] font-bold mb-2">Experiência Profissional</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
                <h3 className="text-xl font-semibold mb-2">Experiência {index + 1}</h3>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Companhia/Empresa"
                    className="p-2 rounded bg-[#1A1038] text-white"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Cargo"
                    className="p-2 rounded bg-[#1A1038] text-white"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                  />
                  <div className="flex flex-col gap-2">
                    <select
                      className="p-2 rounded bg-[#1A1038] text-white"
                      value={exp.startDate.month}
                      onChange={(e) => handleExperienceChange(index, 'startDate', { ...exp.startDate, month: e.target.value })}
                    >
                      <option value="" disabled>Mês Início</option>
                      {months.map(month => <option key={month} value={month}>{month}</option>)}
                    </select>
                    <select
                      className="p-2 rounded bg-[#1A1038] text-white"
                      value={exp.startDate.year}
                      onChange={(e) => handleExperienceChange(index, 'startDate', { ...exp.startDate, year: e.target.value })}
                    >
                      <option value="" disabled>Ano Início</option>
                      {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <select
                      className="p-2 rounded bg-[#1A1038] text-white"
                      value={exp.endDate === 'Atual' ? 'Atual' : (typeof exp.endDate === 'object' ? exp.endDate.month : '')}
                      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value === 'Atual' ? 'Atual' : { ...(typeof exp.endDate === 'object' ? exp.endDate : { month: '', year: '' }), month: e.target.value })}
                      disabled={exp.isCurrent}
                    >
                      <option value="" disabled>Mês Fim</option>
                      {months.map(month => <option key={month} value={month}>{month}</option>)}
                      <option value="Atual">Atual</option>
                    </select>
                    <select
                      className="p-2 rounded bg-[#1A1038] text-white"
                      value={exp.endDate === 'Atual' ? String(currentYear) : (typeof exp.endDate === 'object' ? exp.endDate.year : '')}
                      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value === 'Atual' ? 'Atual' : { ...(typeof exp.endDate === 'object' ? exp.endDate : { month: '', year: '' }), year: e.target.value })}
                      disabled={exp.isCurrent}
                    >
                      <option value="" disabled>Ano Fim</option>
                      {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <label className="flex items-center space-x-2 justify-end sm:justify-start">
                    <input
                      type="checkbox"
                      checked={exp.isCurrent || false}
                      onChange={(e) => handleExperienceChange(index, 'isCurrent', e.target.checked)}
                      className="accent-[#FF66C4]"
                    />
                    <span>Atual</span>
                  </label>
                  <textarea
                    placeholder="Descrição das Atividades Exercidas"
                    rows={4}
                    className="w-full p-2 rounded bg-[#1A1038] text-white col-span-2"
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-700 transition w-full sm:w-auto"
                  onClick={() => removeExperience(index)}
                >
                  Remover Experiência
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-[#1A1038] text-white font-bold px-4 py-2 rounded hover:bg-gray-700 transition w-full sm:w-auto"
              onClick={addExperience}
            >
              Adicionar Experiência
            </button>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl text-[#FF66C4] font-bold mb-2">Formação Acadêmica</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
                <h3 className="text-xl font-semibold mb-2">Formação {index + 1}</h3>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Instituição de Ensino"
                    className="p-2 rounded bg-[#1A1038] text-white"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Grau ou Título"
                    className="p-2 rounded bg-[#1A1038] text-white"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  />
                  <div className="flex flex-col gap-2">
                    <select
                      className="p-2 rounded bg-[#1A1038] text-white"
                      value={edu.startDate.month}
                      onChange={(e) => handleEducationChange(index, 'startDate', { ...edu.startDate, month: e.target.value })}
                    >
                      <option value="" disabled>Mês Início</option>
                      {months.map(month => <option key={month} value={month}>{month}</option>)}
                    </select>
                    <select
                      className="p-2 rounded bg-[#1A1038] text-white"
                      value={edu.startDate.year}
                      onChange={(e) => handleEducationChange(index, 'startDate', { ...edu.startDate, year: e.target.value })}
                    >
                      <option value="" disabled>Ano Início</option>
                      {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <select
                      className="p-2 rounded bg-[#1A1038] text-white"
                      value={edu.endDate === 'Atual' ? 'Atual' : (typeof edu.endDate === 'object' ? edu.endDate.month : '')}
                      onChange={(e) => handleEducationChange(index, 'endDate', e.target.value === 'Atual' ? 'Atual' : { ...(typeof edu.endDate === 'object' ? edu.endDate : { month: '', year: '' }), month: e.target.value })}
                    >
                      <option value="" disabled>Mês Fim</option>
                      {months.map(month => <option key={month} value={month}>{month}</option>)}
                      <option value="Atual">Atual</option>
                    </select>
                    <select
                      className="p-2 rounded bg-[#1A1038] text-white"
                      value={edu.endDate === 'Atual' ? String(currentYear) : (typeof edu.endDate === 'object' ? edu.endDate.year : '')}
                      onChange={(e) => handleEducationChange(index, 'endDate', e.target.value === 'Atual' ? 'Atual' : { ...(typeof edu.endDate === 'object' ? edu.endDate : { month: '', year: '' }), year: e.target.value })}
                      disabled={edu.endDate === 'Atual'}
                    >
                      <option value="" disabled>Ano Fim</option>
                      {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <textarea
                    placeholder="Descrição (opcional)"
                    rows={2}
                    className="w-full p-2 rounded bg-[#1A1038] text-white col-span-2"
                    value={edu.description}
                    onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-700 transition w-full sm:w-auto"
                  onClick={() => removeEducation(index)}
                >
                  Remover Formação
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-[#1A1038] text-white font-bold px-4 py-2 rounded hover:bg-gray-700 transition w-full sm:w-auto"
              onClick={addEducation}
            >
              Adicionar Formação
            </button>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-[#FF66C4] font-bold">Soft Skills</label>
            <textarea name="Soft Skills" rows={4} className="w-full p-2 rounded bg-[#1A1038] text-white" onChange={handleChange} value={formData.sections['Soft Skills']} />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-[#FF66C4] font-bold">Diferenciais</label>
            <textarea name="Diferenciais" rows={4} className="w-full p-2 rounded bg-[#1A1038] text-white" onChange={handleChange} value={formData.sections['Diferenciais']} />
          </div>

          <button
            onClick={handleDownload}
            className="mt-6 bg-[#FF66C4] text-black font-bold px-6 py-2 rounded hover:bg-pink-400 transition w-full sm:w-auto"
            disabled={!pdfPreviewUrl}
          >
            Baixar PDF
          </button>
        </div>
      </div>

      {pdfPreviewUrl && (
        <div className="w-full md:w-1/2 pl-0 md:pl-6 mt-6 md:mt-0 h-[85vh] md:sticky md:top-0">
          <h2 className="text-2xl text-[#FF66C4] font-bold mb-4">Preview do Currículo</h2>
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