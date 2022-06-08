import { h } from 'vue';
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import type { ISelectOption, ISelectProps } from '@/models/base-select';

import BaseSelect from '../base-select.vue';

interface IOptionProps {
    index: number;
    option: ISelectOption;
    selected: boolean;
}

const MockOptionComponent = (props: IOptionProps) => {
    return h('div', { class: ['mock-option', { selected: props.selected }] }, [props.option.name]);
};

describe('base-select component', () => {
    const MOCK_OPTIONS = [
        {
            name: 'name1',
            value: 'slug1',
            disabled: false,
        },
        {
            name: 'name2',
            value: 'slug2',
            disabled: false,
        },
        {
            name: 'name3',
            value: 'slug3',
            disabled: true,
        },
    ];
    const DISABLED_OPTIONS = MOCK_OPTIONS.filter(({ disabled }) => disabled);

    const render = ({ options = MOCK_OPTIONS, modelSelected }: Partial<ISelectProps> = {}) => {
        return mount(BaseSelect, {
            props: {
                options,
                modelSelected,
            },
            slots: {
                default: MockOptionComponent,
                header: '<div class="header" />',
                footer: '<div class="footer" />',
            },
        });
    };

    it('renders slots', async () => {
        const wrapper = render();

        expect(wrapper.findAll('.header')).toHaveLength(1);
        expect(wrapper.findAll('.footer')).toHaveLength(1);
    });

    it('renders all options', async () => {
        const wrapper = render();

        const options = wrapper.findAll('.mock-option');
        expect(options).toHaveLength(MOCK_OPTIONS.length);
    });

    it('passes `option` object to default slot', async () => {
        const wrapper = render();

        const options = wrapper.findAll('.mock-option');
        MOCK_OPTIONS.forEach((option, index) => {
            expect(options[index].text()).toBe(option.name);
        });
    });

    it('sets `disabled`', async () => {
        const wrapper = render();

        const disabledOptionsList = wrapper.findAll('.disabled');

        expect(disabledOptionsList.length).toBe(DISABLED_OPTIONS.length);
        DISABLED_OPTIONS.forEach((option, index) => {
            expect(disabledOptionsList[index].text()).toBe(option.name);
        });
    });

    it('handles `v-mode:selected` as flag for option', async () => {
        const SELECTED_OPTION = MOCK_OPTIONS[0];
        const wrapper = render({ modelSelected: SELECTED_OPTION });

        expect(wrapper.findAll('.mock-option.selected').length).toBe(1);
        expect(wrapper.find('.mock-option.selected').text()).toBe(SELECTED_OPTION.name);
    });

    it('ignores `selected` flag if not provided', async () => {
        const wrapper = render();

        expect(wrapper.findAll('.mock-option.selected').length).toBe(0);
    });

    it('emits `v-model:selected` on click', async () => {
        const CLICKED_ITEM_INDEX = 1;
        const wrapper = render();
        const options = wrapper.findAll('.mock-option');

        expect(wrapper.findAll('.mock-option.selected').length).toBe(0);

        await options[CLICKED_ITEM_INDEX].trigger('click');

        const onSelectEvents = wrapper.emitted<IOptionProps>()['update:modelSelected'];

        expect(onSelectEvents.length).toBe(1);
        expect(onSelectEvents[0]).toEqual([MOCK_OPTIONS[CLICKED_ITEM_INDEX]]);
    });

    it('ignores click on disabled options', async () => {
        const CLICKED_ITEM_INDEX = MOCK_OPTIONS.findIndex(({ disabled }) => disabled);
        const wrapper = render();
        const options = wrapper.findAll('.mock-option');

        await options[CLICKED_ITEM_INDEX].trigger('click');

        const onSelectEvents = wrapper.emitted<IOptionProps>()['update:modelSelected'];

        expect(onSelectEvents).toBeUndefined();
    });

    // and so on...
});
