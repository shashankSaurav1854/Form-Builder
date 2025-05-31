import { useState, useEffect } from 'react';
import {  
  Edit3, 
  Trash2, 
  Settings, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Save, 
  Share2, 
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Copy,
  FileText,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  List,
  Type,
  Hash,
  ToggleLeft
} from 'lucide-react';

const predefinedTemplates = [
  {
    id: 'contact',
    name: 'Contact Us',
    fields: [
      { id: '1', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
      { id: '2', type: 'email', label: 'Email Address', required: true, placeholder: 'your.email@example.com' },
      { id: '3', type: 'phone', label: 'Phone Number', placeholder: 'Your phone number' },
      { id: '4', type: 'select', label: 'Subject', required: true, options: ['General Inquiry', 'Support', 'Sales'] },
      { id: '5', type: 'textarea', label: 'Message', required: true, placeholder: 'Tell us how we can help...' }
    ]
  },
  {
    id: 'survey',
    name: 'Customer Survey',
    fields: [
      { id: '1', type: 'text', label: 'Name', required: true },
      { id: '2', type: 'email', label: 'Email', required: true },
      { id: '3', type: 'radio', label: 'Overall Rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
      { id: '4', type: 'checkbox', label: 'Which features do you use?', options: ['Feature A', 'Feature B', 'Feature C'] },
      { id: '5', type: 'textarea', label: 'Additional Comments', placeholder: 'Any other feedback?' }
    ]
  }
];

const FormBuilder = () => {
  type Field = {
    id: string;
    type: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    helpText?: string;
    options?: string[];
    validation?: {
      minLength?: number;
      maxLength?: number;
      min?: number;
      max?: number;
    };
    style?: object;
  };

    type SavedForm = {
    id: string;
    title: string;
    description: string;
    fields: Field[];
    settings: typeof formSettings;
    createdAt: string;
  };
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  type TemplateField = {
    id: string;
    type: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: string[];
  };

  type Template = {
    id: string;
    name: string;
    fields: TemplateField[];
  };

  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('builder');
  const [formSettings, setFormSettings] = useState({
    title: 'New Form',
    description: '',
    multiStep: false,
    stepsPerPage: 3
  });
  const [draggedField, setDraggedField] = useState<Field | null>(null);
  const [shareableId, setShareableId] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | number | boolean | string[]>>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] }>({});
  const [showShareModal, setShowShareModal] = useState(false);

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: Type },
    { type: 'textarea', label: 'Textarea', icon: FileText },
    { type: 'email', label: 'Email', icon: Mail },
    { type: 'phone', label: 'Phone', icon: Phone },
    { type: 'number', label: 'Number', icon: Hash },
    { type: 'date', label: 'Date', icon: Calendar },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { type: 'radio', label: 'Radio Button', icon: ToggleLeft },
    { type: 'select', label: 'Dropdown', icon: List }
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedForms') || '[]');
    setSavedForms(saved);
    setTemplates(predefinedTemplates);
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addField = (fieldType: string) => {
    const newField = {
      id: generateId(),
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: '',
      required: false,
      helpText: '',
      options: fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox' ? ['Option 1'] : [],
      validation: {},
      style: {}
    };
    setFields([...fields, newField]);
  };

 const updateField = (id: string, updates: Partial<Field>) => {
  setFields(prevFields =>
    prevFields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    )
  );
};


  const deleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    if (selectedField?.id === id) {
      setSelectedField(null);
    }
  };

  const reorderFields = (dragIndex: number, hoverIndex: number) => {
    const draggedField = fields[dragIndex];
    const newFields = [...fields];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedField);
    setFields(newFields);
  };

  const saveForm = () => {
    const formId = shareableId || generateId();
    const formToSave = {
      id: formId,
      title: formSettings.title,
      description: formSettings.description,
      fields: fields,
      settings: formSettings,
      createdAt: new Date().toISOString()
    };

    const existing = savedForms.findIndex(form => form.id === formId);
    let newSavedForms;
    
    if (existing >= 0) {
      newSavedForms = [...savedForms];
      newSavedForms[existing] = formToSave;
    } else {
      newSavedForms = [...savedForms, formToSave];
    }

    setSavedForms(newSavedForms);
    localStorage.setItem('savedForms', JSON.stringify(newSavedForms));
    setShareableId(formId);
    alert('Form saved successfully!');
  };

  const loadForm = (formData: SavedForm) => {
    setFields(formData.fields);
    setFormSettings(formData.settings);
    setShareableId(formData.id);
  };

  const loadTemplate = (template: Template) => {
    setFields(template.fields);
    setFormSettings({ ...formSettings, title: template.name });
  };

  const generateShareableLink = () => {
    if (!shareableId) {
      saveForm();
    }
    setShowShareModal(true);
  };

  const validateField = (field: Field, value: string | number | boolean | string[]) => {
    const errors = [];

    if (
      field.required &&
      (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (typeof value === 'boolean' && value === false) ||
        (typeof value === 'number' && isNaN(value))
      )
    ) {
      errors.push('This field is required');
    }

    if (value && field.validation) {
      if (
        field.validation.minLength &&
        typeof value === 'string' &&
        value.length < field.validation.minLength
      ) {
        errors.push(`Minimum ${field.validation.minLength} characters required`);
      }
      if (
        field.validation.maxLength &&
        typeof value === 'string' &&
        value.length > field.validation.maxLength
      ) {
        errors.push(`Maximum ${field.validation.maxLength} characters allowed`);
      }
      if (
        field.type === 'email' &&
        typeof value === 'string' &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        errors.push('Please enter a valid email address');
      }
      if (
        field.type === 'phone' &&
        typeof value === 'string' &&
        !/^\+?[\d\s\-()]{10,}$/.test(value)
      ) {
        errors.push('Please enter a valid phone number');
      }
    }

    return errors;
  };

  const handleFieldChange = (fieldId: string, value: string | number | boolean | string[]) => {
    setFormData({ ...formData, [fieldId]: value });
    
    const field = fields.find(f => f.id === fieldId);
    const errors = field ? validateField(field, value) : [];
    
    setValidationErrors({
      ...validationErrors,
      [fieldId]: errors
    });
  };

  const getSteps = () => {
    if (!formSettings.multiStep) return [fields];
    
    const steps = [];
    const stepsPerPage = formSettings.stepsPerPage || 3;
    
    for (let i = 0; i < fields.length; i += stepsPerPage) {
      steps.push(fields.slice(i, i + stepsPerPage));
    }
    
    return steps.length ? steps : [[]];
  };

  const renderField = (field: Field, preview = false) => {
    const value = formData[field.id] || '';
    const errors = validationErrors[field.id] || [];
    const hasError = errors.length > 0;

    const baseInputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;

    const renderInput = () => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'phone':
          return (
            <input
              type={field.type === 'phone' ? 'tel' : field.type}
              className={baseInputClasses}
              placeholder={field.placeholder}
              value={typeof value === 'boolean' ? (value ? 'true' : '') : value}
              onChange={(e) => preview && handleFieldChange(field.id, e.target.value)}
              required={field.required}
            />
          );
        
        case 'number':
          return (
            <input
              type="number"
              className={baseInputClasses}
              placeholder={field.placeholder}
              value={value === true ? '' : value}
              onChange={(e) => preview && handleFieldChange(field.id, e.target.value)}
              required={field.required}
              min={field.validation?.min}
              max={field.validation?.max}
            />
          );
        
        case 'date':
          return (
            <input
              type="date"
              className={baseInputClasses}
              value={value === true ? '' : value}
              onChange={(e) => preview && handleFieldChange(field.id, e.target.value)}
              required={field.required}
            />
          );
        
        case 'textarea':
          return (
            <textarea
              className={`${baseInputClasses} h-24 resize-none`}
              placeholder={field.placeholder}
              value={typeof value === 'string' || typeof value === 'number' ? value : ''}
              onChange={(e) => preview && handleFieldChange(field.id, e.target.value)}
              required={field.required}
              rows={3}
            />
          );
        
        case 'select':
          return (
            <select
              className={baseInputClasses}
              value={value === true ? '' : value}
              onChange={(e) => preview && handleFieldChange(field.id, e.target.value)}
              required={field.required}
            >
              <option value="">Select an option</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          );
        
        case 'radio':
          return (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => preview && handleFieldChange(field.id, e.target.value)}
                    className="text-blue-600"
                    required={field.required}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          );
        
        case 'checkbox': {
          const checkboxValues = Array.isArray(value) ? value : [];
          return (
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option}
                    checked={checkboxValues.includes(option)}
                    onChange={(e) => {
                      if (!preview) return;
                      const newValues = e.target.checked
                        ? [...checkboxValues, option]
                        : checkboxValues.filter(v => v !== option);
                      handleFieldChange(field.id, newValues);
                    }}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          );
        }
        
        default:
          return <div className="text-gray-400">Unknown field type</div>;
      }
    };

    return (
      <div
        key={field.id}
        className={`p-4 border border-gray-200 rounded-lg ${
          selectedField?.id === field.id ? 'ring-2 ring-blue-500' : ''
        } ${preview ? '' : 'cursor-pointer hover:border-gray-300'}`}
        onClick={() => !preview && setSelectedField(field)}
        role={!preview ? "button" : undefined}
        tabIndex={!preview ? 0 : undefined}
        onKeyDown={(e) => {
          if (!preview && (e.key === 'Enter' || e.key === ' ')) {
            setSelectedField(field);
          }
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {!preview && (
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedField(field);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-500"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteField(field.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
          
          {renderInput()}
          
          {field.helpText && (
            <p className="text-xs text-gray-500">{field.helpText}</p>
          )}
          
          {preview && hasError && (
            <div className="flex items-center space-x-1 text-red-500 text-xs">
              <AlertCircle size={12} />
              <span>{errors[0]}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFieldProperties = () => {
    if (!selectedField) {
      return (
        <div className="p-6 text-center text-gray-500">
          <Settings size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Select a field to edit its properties</p>
        </div>
      );
    }

    return (
      <div key = {selectedField.id} className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Field Properties</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="field-label-input" className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              id="field-label-input"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedField.label}
              onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor='field-placeholder-input' className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              id='field-placeholder-input'
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedField.placeholder || ''}
              onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="field-help-text-input" className="block text-sm font-medium text-gray-700 mb-1">
              Help Text
            </label>
            <input
              id='field-help-text-input'
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedField.helpText || ''}
              onChange={(e) => updateField(selectedField.id, { helpText: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={selectedField.required || false}
              onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
              className="text-blue-600"
            />
            <label htmlFor="required" className="text-sm font-medium text-gray-700">
              Required field
            </label>
          </div>

          {(selectedField.type === 'select' || selectedField.type === 'radio' || selectedField.type === 'checkbox') && (
            <div>
              <label htmlFor="options" className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {selectedField.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(selectedField.options || [])];
                        newOptions[index] = e.target.value;
                        updateField(selectedField.id, { options: newOptions });
                      }}
                    />
                    <button
                      onClick={() => {
                        const newOptions = (selectedField.options || []).filter((_, i) => i !== index);
                        updateField(selectedField.id, { options: newOptions });
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                    updateField(selectedField.id, { options: newOptions });
                  }}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500"
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}

          {(selectedField.type === 'text' || selectedField.type === 'textarea') && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Validation</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor='min-length' className="block text-xs text-gray-500 mb-1">Min Length</label>
                  <input
                  id='min-length'
                    type="number"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    value={selectedField.validation?.minLength || ''}
                    onChange={(e) => updateField(selectedField.id, {
                      validation: { ...selectedField.validation, minLength: parseInt(e.target.value) || undefined }
                    })}
                  />
                </div>
                <div>
                  <label htmlFor='max-length' className="block text-xs text-gray-500 mb-1">Max Length</label>
                  <input
                  id='max-length'
                    type="number"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    value={selectedField.validation?.maxLength || ''}
                    onChange={(e) => updateField(selectedField.id, {
                      validation: { ...selectedField.validation, maxLength: parseInt(e.target.value) || undefined }
                    })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    const steps = getSteps();
    const currentStepFields = steps[currentStep] || [];
    
    const deviceClasses = {
      desktop: 'max-w-4xl',
      tablet: 'max-w-2xl',
      mobile: 'max-w-sm'
    };

    return (
      <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
        <div className={`w-full ${deviceClasses[previewMode]} bg-white rounded-lg shadow-lg p-6`}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{formSettings.title}</h1>
            {formSettings.description && (
              <p className="text-gray-600">{formSettings.description}</p>
            )}
          </div>

          {formSettings.multiStep && steps.length > 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          <form className="space-y-4">
            {currentStepFields.map(field => renderField(field, true))}
            
            {formSettings.multiStep && steps.length > 1 && (
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Check size={16} />
                    <span>Submit</span>
                  </button>
                )}
              </div>
            )}
            
            {!formSettings.multiStep && (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Form
              </button>
            )}
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Form Builder</h1>
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('builder')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'builder'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Builder
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'preview'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {activeTab === 'preview' && (
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow' : ''}`}
                  >
                    <Monitor size={18} />
                  </button>
                  <button
                    onClick={() => setPreviewMode('tablet')}
                    className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow' : ''}`}
                  >
                    <Tablet size={18} />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow' : ''}`}
                  >
                    <Smartphone size={18} />
                  </button>
                </div>
              )}
              
              <button
                onClick={saveForm}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
              
              <button
                onClick={generateShareableLink}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {activeTab === 'builder' ? (
        <div className="flex h-screen">
          {/* Sidebar - Field Types */}
          <div className="w-64 bg-white shadow-sm border-r overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="form-title-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Form Title
                  </label>
                  <input
                  id='form-title-input'
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formSettings.title}
                    onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor='form-description' className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                    value={formSettings.description}
                    onChange={(e) => setFormSettings({ ...formSettings, description: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="multiStep"
                    checked={formSettings.multiStep}
                    onChange={(e) => setFormSettings({ ...formSettings, multiStep: e.target.checked })}
                    className="text-blue-600"
                  />
                  <label htmlFor="multiStep" className="text-sm font-medium text-gray-700">
                    Multi-step form
                  </label>
                </div>
                
                {formSettings.multiStep && (
                  <div>
                    <label htmlFor='steps-per-page' className="block text-sm font-medium text-gray-700 mb-1">
                      Fields per step
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formSettings.stepsPerPage}
                      onChange={(e) => setFormSettings({ ...formSettings, stepsPerPage: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                )}
              </div>

              <h3 className="text-md font-semibold text-gray-900 mb-3">Field Types</h3>
              <div className="space-y-2">
                {fieldTypes.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('fieldType', type)}
                    // onClick={() => addField(type)}
                    className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Icon size={18} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">Templates</h3>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => loadTemplate(template)}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700">{template.name}</span>
                      <p className="text-xs text-gray-500 mt-1">{template.fields.length} fields</p>
                    </button>
                  ))}
                </div>
              </div>

              {savedForms.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Saved Forms</h3>
                  <div className="space-y-2">
                    {savedForms.map((form) => (
                      <button
                        key={form.id}
                        onClick={() => loadForm(form)}
                        className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700">{form.title}</span>
                        <p className="text-xs text-gray-500 mt-1">
                          {form.fields.length} fields • {new Date(form.createdAt).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Form Builder */}
          <div className="flex-1 flex">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{formSettings.title}</h2>
                    {formSettings.description && (
                      <p className="text-gray-600">{formSettings.description}</p>
                    )}
                  </div>
                    <div
                      className="space-y-4"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fieldType = e.dataTransfer.getData('fieldType');
                        if (fieldType) {
                          addField(fieldType);
                        }
                      }}
                    >
                    {fields.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg mb-2">Start building your form</p>
                        <p className="text-sm">Drag fields from the sidebar to get started</p>
                      </div>
                    ) : (
                      fields.map((field) => (
                        <div
                          key={field.id}
                          draggable
                          onDragStart={() => setDraggedField(field)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedField && draggedField.id !== field.id) {
                              const dragIndex = fields.findIndex(f => f.id === draggedField.id);
                              const hoverIndex = fields.findIndex(f => f.id === field.id);
                              reorderFields(dragIndex, hoverIndex);
                            }
                            setDraggedField(null);
                          }}
                          className="relative"
                        >
                          {renderField(field)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Panel */}
            <div className="w-80 bg-white shadow-sm border-l">
              {renderFieldProperties()}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {renderPreview()}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Form</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor='shareable-id' className="block text-sm font-medium text-gray-700 mb-2">
                  Form ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableId}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(shareableId)}
                    className="p-2 text-gray-500 hover:text-blue-500"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor='shareable-url' className="block text-sm font-medium text-gray-700 mb-2">
                  Shareable URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/form/${shareableId}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/form/${shareableId}`)}
                    className="p-2 text-gray-500 hover:text-blue-500"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a demo URL. In a real application, this would link to a public form viewer where users can fill out your form.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/form/${shareableId}`);
                  alert('URL copied to clipboard!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;