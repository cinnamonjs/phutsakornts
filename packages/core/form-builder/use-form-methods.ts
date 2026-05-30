import { useCallback, useRef } from "react";

export type FormMethods<T = Record<string, unknown>> = {
	setValue: (name: string, value: unknown) => void;
	setValues: (values: Partial<T>) => void;
	getValues: () => Partial<T>;
	reset: (values?: Partial<T>) => void;
	watch: (name?: string) => unknown;
};

export function useFormMethods<T = Record<string, unknown>>() {
	const formMethodsRef = useRef<FormMethods<T> | null>(null);

	const onFormReady = useCallback((methods: FormMethods<T>) => {
		formMethodsRef.current = methods;
	}, []);

	const setValue = useCallback((name: string, value: unknown) => {
		if (formMethodsRef.current) {
			formMethodsRef.current.setValue(name, value);
		}
	}, []);

	const setValues = useCallback((values: Partial<T>) => {
		if (formMethodsRef.current) {
			formMethodsRef.current.setValues(values);
		}
	}, []);

	const getValues = useCallback((): Partial<T> => {
		if (formMethodsRef.current) {
			return formMethodsRef.current.getValues();
		}
		return {};
	}, []);

	const reset = useCallback((values?: Partial<T>) => {
		if (formMethodsRef.current) {
			formMethodsRef.current.reset(values);
		}
	}, []);

	const watch = useCallback((name?: string) => {
		if (formMethodsRef.current) {
			return formMethodsRef.current.watch(name);
		}
		return undefined;
	}, []);

	return {
		onFormReady,
		setValue,
		setValues,
		getValues,
		reset,
		watch,
		isReady: !!formMethodsRef.current,
	};
}
