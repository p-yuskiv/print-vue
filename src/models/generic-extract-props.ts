export type ExtractProps<TComponent> = TComponent extends new () => { $props: infer TProps }
    ? TProps
    : never;
