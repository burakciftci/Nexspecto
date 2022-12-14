/* eslint-disable */
export default {
  deadline:{
    description:'What is the optimal due date for this step?',
    thisStep: 'This step',
    stepOptionPlaceholder:'Step Options',
    timeDeadlineOptionPlaceholder:'Deadline Options',
    timeUnitPlaceholder:'Unit',
    timeValue:'Time',
    done:'done task',
    startOfProcess:'Start of process',
    endOfLastProcess:'The last step of this template',
    after:'after',
    before:'before',
    minutes:'minutes',
    hours:'hours',
    days:'days',
    weeks:'weeks',
    months:'months',
  },
  task: {
    newCommentLabel: 'Comment',
    newCommentPlaceholder: 'Enter the comment',
    newCommenmtButton: 'Add Comment'
  },
  newprocess: {
    newprocessTitle: 'Create New Process',
    newprocessSubTitle: 'Please name your process and review your any steps.',
    titleLabel: 'Process Title',
    titlePlaceholder: 'Please enter the title',
    buttonSavenewprocess: 'Continue',
    loadSummaryError: 'Process template information did not loaded.',
    createSuccessMessage: 'Success!',
    createSuccessContinue: 'Creating template is succesful. You will link to process.',
    formItemsTitle: 'Data Collection Fields',
    formItemTitle: 'Title',
    formItemGroupName: 'Group Name',
    formItemDeadline: 'Dead Line',
    required: 'Required',
  },
  settings: {
    description: 'General settings for process',
    isMandatory:'This step is required',
    isRenewable:'This step can be open again',
    canChange: 'Deadline can change',
    isHidden :'Make invisible'
  },

  templateList: {
    createButtonText: 'Create New Template',
    startProcessButtonText: 'Create Process',
    codetitle: 'Operation Unit',
    title: 'Template',
    description: 'Description',
    actions: 'Actions',
    archives: 'Archives',
    actives: 'Actives',
    none: 'None'
  },

  tasklist: {
    searchText: 'Search...',
    filter: 'Filter',
    pageTitle: 'Task List',
    pageDescription: 'List shows tasks belongs to company. If task is yours it will be listed green color.',
    perpage: 'Per Page',
    hide: 'Hide',
    show: 'Show',
    detail: 'Details',
    complete: 'Complete',
    task: 'Task',
    isActive: 'Is Active',
    progress: 'Progress',
    owner: 'Owner',
    createDate: 'Create Date',
    actions: 'Actions',
    name: 'Name Surname',
    all: 'All',
    info: 'Click to see the process details.'
  },
  processlist: {
    searchText: 'Search...',
    filter: 'Filter',
    pageTitle: 'Active process List',
    pageDescription: 'processes created from you or assigned to you will be listed in this page.',
    processCategory: 'Operation Unit',
    errorMessage: 'Active process list did not read from server.',
    status: 'Status',
    process: 'Process',
    startedBy: 'Started By',
    nextTask: 'Next Task',
    progression: 'Progression',
    actions: 'Actions'
  },
  template: {
    createTemplateTitle: 'Create New Template',
    createTemplateSubTitle: 'Create new template for bpm',
    updateTemplateTitle: 'Update Template',
    updateTemplateSubTitle: 'You can update your template',
    titlePlaceholder: 'Enter Template Name',
    titleLabel: 'Template Name',
    descriptionPlaceholder: 'Enter Template Description',
    descriptionLabel: 'Template Description',
    codePlaceholder: 'Select Operation Unit',
    codeLabel: 'Select Operation Unit',
    buttonSaveTemplate: 'Save Template',
    buttonUpdateTemplate: 'Update Template',
    processInstructionPlaceholder: 'Enter Process Instruction ',
    processInstructionLabel: 'Process Instruction',
    iconPlaceholder: 'Enter Icon',
    iconLabel: 'Icon',
    createSuccessMessage: 'Success!',
    createSuccessContinue: 'You have created template successfully. You will be redirect to detail page to continue.',
    editSuccessMessage: 'Update!',
    editSuccessContinue: 'You have updated template successfuly.',
    deleteTemplate: 'Delete',
    cancelTemplate: 'Discard Changes',
    deleteQuestion: 'This will permanently delete the form item. Are you sure?',
    archiveQuestion: 'This will move this template to archive',
    unarchiveQuestion: 'This will move this template to active',
    archiveNotify: 'Archive Confirmation',
    errorTemplateCode: 'Organization list did not read from server.',
    requiredTitle: 'Template name is required',
    lengthTitle: 'Template name must be between 5 and 250 characters',
    requiredDescription: 'Template description is required',
    lengthDescription: 'Template description must be between 5 and 500 characters',
    requiredProcessInstruction: 'Process instruction is required',
    lengthProcessInstruction: 'Process instruction must be between 5 and 5000 characters',
    requiredCode: 'Operation unit is required',
  },
  newStep: {
    titlePlaceholder: 'Enter Step Name',
    titleLabel: 'Step Name',
    buttonCreate: 'Create Step',
    createSuccessMessage: 'Success!',
    createSuccessContinue: 'Template created successfully. You will be redirect to process list page to continue.',
    requiredTitle: 'Title is required',
    lengthTitle: 'Title must be between 5 and 250 characters',
  },
  processListItem:{
    next: 'Next',
    Owner: 'I started',
    Wait: 'wait for me',
    Pass: 'completed',
    Issue: 'issue',
    owner: 'Owner',
    status: 'Status',
  },
  step: {
    deadline: 'Deadline: %timeCount %timeUnit %after %deadlineTemplateStepId',
    startOfProcess: 'Start of process',
    step: 'step',
    formCount:'Number of form item',
    open: 'Open',
    openDescription: 'Open template step editor',
    assignGroup: 'Assing to ',
    title: 'Edit Template Step Detail',
    general: 'Step Informations',
    titleLabel: 'Step Label',
    titlePlaceholder: 'Enter Step Label',
    detailsLabel: 'Step Details',
    detailsPlaceholder: 'Enter Step Details',
    form: 'Form',
    assign: 'Assign',
    deadline:'Deadline',
    rules:'Rules',
    advanced:'Advanced',
    deleteQuestion: 'This will permanently delete the form item. Are you sure?',
    requiredTitle: 'Step label is required',
    lengthTitle: 'Step label must be between 5 and 5000 characters',
    requiredDetails: 'Step details is required',
    lengthDetails: 'Step details must be grather thann 5 characters',
  },
  newFormItem: {
    typePlaceholder: 'Enter Form Item',
    typeLabel: 'Form Item ', 
    instantdeliveryDescription: 'H??zl?? Teslimat Tarih Se??imi',
    partynote: 'Customer Note',
    partynoteDescription: 'Customer Note Description',
    saveButton: 'Add This Form Item',
    smalltextfieldDescription: 'Small Text ',
    largetextariaDescription:  'Large Text',
    dropdownlistDescription:   'Dropdown List',
    checklistDescription:      'Check List',
    radiobuttonsDescription:   'Radio List',
    numericDescription: 'Numeric',
    dateDescription: 'Date',
    smalltextfield: 'Small Text ',
    largetextaria:  'Large Text',
    dropdownlist:   'Dropdown List',
    checklist:      'Check List',
    radiobuttons:   'Radio List',
    date: 'Date',
    numeric: 'Numeric',
  },
  formItem: {
    title: 'Update Form Item',
    smalltextfieldLabelLabel: 'Label',
    smalltextfieldLabelPalceholder: 'Enter Label',
    smalltextfieldPlaceholderLabel: 'Description',
    smalltextfieldPlaceholderPalceholder: 'Enter Description',
    smalltextfieldIsRequired: 'Required',
    largetextariaLabelLabel: 'Label',
    largetextariaLabelPalceholder: 'Enter Label',
    largetextariaRowsLabel: 'Rows',
    largetextariaRowsPalceholder: 'Enter Rows',
    largetextariaIsRequired: 'Required', 
    dropdownlistLabelLabel: 'Label',
    dropdownlistLabelPalceholder: 'Enter Label',
    dropdownlistOptionsStringLabel: 'Options',
    dropdownlistOptionsStringPalceholder: 'Enter Options as | Between Them',
    dropdownlistIsRequired: 'Zorunlu',   
    checklistLabelLabel: 'Label',
    checklistLabelPalceholder: 'Enter Label',
    checklistOptionsStringLabel: 'Options',
    checklistOptionsStringPalceholder: 'Enter Options as | Between Them',
    checklistIsRequired: 'Zorunlu',
    radiobuttonstLabelLabel: 'Label',
    radiobuttonstLabelPalceholder: 'Enter Label',
    radiobuttonstOptionsStringLabel: 'Options',
    radiobuttonstOptionsStringPalceholder: 'Enter Options as | Between Them',
    radiobuttonstIsRequired: 'Zorunlu',
    dateLabelLabel: 'Etiket',
    dateLabelPlaceholder: 'Etiket Giriniz',
    datePlaceholderLabel: 'A????klama',
    datePlaceholderPlaceholder: 'A????klama Giriniz',
    dateIsRequired: 'Zorunlu',
    deleteQuestion: 'This will permanently delete the form item. Are you sure?',
    requiredLabel: 'Etiket giriniz',
    lengthLabel: 'Etiket 2 ile 250 karakter aras??nda olmal??d??r',
    requiredPlaceholder: 'A????klama giriniz',
    lengthPlaceholder: 'A????klama 2 ile 250 karakter aras??nda olmal??d??r',
    requiredCols: 'Geni??lik giriniz',
    requiredRows: 'Sat??r say??s?? giriniz',
    requiredOptionsString: 'Se??enekleri giriniz',
    lengthOptionsString: 'Se??enekler 2 ile 2500 karaketer aras??nda olmal??d??r'
  },
  assign: {
    getTitleCodesError: 'Title list not reviced',
    description: 'Who should be assigned this step at the start of the process?',
    owner:'Process Starter',
    specificGroup:'Specific Group',
    assignGroupPlaceholder:'Write Group Name',
    assignGroupTaskDropdownLabel:'Select Task',
    assignGroupTaskDropdownPlaceholder:'Select Task',
    assignGroupPlaceDropdownLabel:'Select Work Place',
    assignGroupPlaceDropdownPlaceholder:'Select Work Place',
    assignOwnerSelectedDesc:'The coworker starting this process will be assigned this step',
    nooptions: 'Organization shema did not load',
  },
  rule:{
    if:'If',
    thistask:'this task.',
    step:'Rules',
    ruleValue:'Value',
    condition:'Conditions',
    action:'Actions',
    command:'Logic',
    description: 'Create rules to hide and show this task',
    newRuleButton: 'Add New Rule Condition',
    AND: 'And',
    OR: 'Or',
    contains: 'Contains',
    notcontains: 'Not Contains',
    equals: 'Equals',
    notequals: 'Not Equals',
    greaterthan: 'Greater',
    smallerthan : 'Smaller',
    deleteRuleButton: 'Del',
    deleteQuestion: 'This will permanently delete the form item. Are you sure?',
  },
  notifyArchive: {
    archiveNotify: 'Archive Confirmation',
    archiveWarning: '',
    archiveRemove: 'Remove to archive',
    archiveCancel: 'Cancel',
    archiveSuccess: 'Moved to archive',
    archiveCanceled: 'Canceled',
    unarchiveNotify: 'Active Confirmation',
    unarchiveWarning: '',
    unarchiveRemove: 'Remove to active',
    unarchiveCancel: 'Cancel',
    unarchiveSuccess: 'Moved to active',
    unarchiveCanceled: 'Canceled',
  },
  tooltips: {
    startProcess: 'Start Process',
    editTemplate: 'Edit',
    archive: 'Archive',
    deleteTemplate: 'Delete',
    unarchive: 'Unarchive',
    viewProcess: 'View Process',
    viewTemplate: 'View Template'

  },
  multitask: {
    started: 'Assigned date of oldest task',
    deadline: 'Task date of first task',    
    formItemCount: 'Number of form items',
    user: 'Assigned user',
    processTitle: 'Process',
    startedTitle: 'Begin',
    deadlineTitle: 'End',
    detailsTitle: 'Description',
    statusTitle: 'Status',
    status_deadline: 'Expired',
    requiredMessage: 'Value is required',
    order: 'Task order on process',
    createTask: 'Create Task',
    freetask: 'Independent Task',
    status_open: 'Active',
    status_completed: 'Completed'
  },
  newtask: {
    cancelTask: 'Vazge??',
    buttonSaveTask: 'G??rev Kaydet',
    titleLabel: 'Ba??l??k',
    titlePlaceholder: 'G??rev ba??l?????? giriniz',
    descriptionLabel: 'A????klama',
    descriptionPlaceholder: 'A????klama giriniz',
    deadline: 'Son Tarih',
    deadlinePlaceholder: 'Son tarihi giriniz',
    requiredTitle: 'Ba??l???? giriniz',
    lengthTitle: 'Ba??l??k 5 ile 250 karakter aras??nda olmal??d??r',
    requiredDescription: 'A????klama giriniz',
    lengthDescription: 'A????klama 5 ile 500 karakter aras??nda olmal??d??r',
    requiredassignTo: 'Atanan kullan??c?? se??ilmelidir',
    requiredDeadline: 'Son tarihi se??ilmelidir',
    tomorrow: 'Yar??n',
    twodaylater: '??ki g??n sonra',
    treedaylater: '???? g??n sonra',
    aweeklater : 'Bir hafta sonra',
    twoweeklater: '??ki hafta sonra',
    amonthlater: 'Bir ay sonra',
    assignTo: 'Atama',
    assignToPlaceholder: 'Atama yap??lacak kullan??c?? se??iniz',
    requiredassignTo: 'Atama yap??lacak kullan??c?? se??ilmelidir',
    createSuccessMessage: 'Ba??ar??l??!',
    createSuccessContinue: 'G??rev olu??turma i??lemi ba??ar??l?? bir ??ekilde ger??ekle??ti. G??rev listesine y??nlendirileceksiniz.',
  },
  // error olarak ??al????m??yor, error(s) yap??ld??. 
  errors:{
    TemplateAlreadyDefinedWithSameTitle: 'Template is already defined with name "{title}" ',
    TemplateStepAlreadyDefinedWithSameTitle: 'Template step is already defined with name "{title}" ',
  },
}