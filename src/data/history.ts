export const HISTORY = [
    '!Summarized user story',
    ' ',
    '!As a user:',
    'I want to see a list of products',
    'I want to choose product properties',
    'I want to see a list of available options in each of the product properties',
    'I want to add the product to the cart',
    'I want to view the products in the cart',
    'I want to remove products from the cart',
    ' ',
    '!The system',
    'receives a list of products from the server',
    'receives a list of product properties from the server',
    'controls the availability of options and properties according to the provided list of exceptions (impossible combinations of options and properties)',
    'allows to add the product to the cart after making a selection in all available properties (the property is user-selected, there is only one option, there are no available options)',
    'considers as selected the only available option in the property',
    'considers the property as optional if there are no options left after applying the exceptions',
    ' ',
    '!Implementation details',
    'Product properties contain a fixed list of options',
    'Product properties may include options that allow the user to enter the required values ("custom field").',
    'To control the values in the "custom field", a "CustomSizes" object is added to the product property, which can contain a "unitType" field and a pairs of fields that specify the minimum and maximum value of the additional characteristic for the "min_name_" and "max_name_" (such as "minWidth"/"maxWidth", "minSize"/"maxSize").',
    'To control the values in the "custom field", the "type" field can be specified as part of the option (currently it is allowed to use "digital" to enter any integer greater than 0).',
    'In the "excludes" array, a string is used to control the correctness of the values in the "custom field"',
    '"_optionName_:_characteristicName_:_range_[:_characteristicName_:_range_ | ...]"',
    'Where _range_ is a string of type "[_minValue_] - [_maxValue_] [,[_minValue_] - [_maxValue_] | ...]" (like “custom :width :100-200, 300-400 :height:-1000”)',
    '(although I personally would prefer to write “custom :width=100-200, 300-400 :height=-1000”, which is why saving the selection results is saved this way)',
    ' ',
    ' ',
    'Most interesting in the task was the need to track alive available options for "custom field".',
    ' ',
    'The main technical points (due to the limited time, they may not be present in all components):',
    'HTML5 - semantics and accessibility (basic views and base-select component)',
    'CSS3, SCSS - adaptive, responsive, animation, stylization using variables, mixins, functions ...',
    'Stack - Vue 3, Vue-Router, Pinia, Typescript (UI framework and other packages were not used intentionally)',
    'Generic headless components for further customization (base-select)',
    'Unit tests (exclusively for demonstration)',
    'Programming patterns (too lazy to list it)',
];
