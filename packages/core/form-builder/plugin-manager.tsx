import { createContext, type ReactNode, useContext } from "react";
import type { FieldComponentProps, PluginConfig } from "@/components/module/form-builder/types";

type PluginContextType = {
	plugins: Record<string, PluginConfig>;
	registerPlugin: (plugin: PluginConfig) => void;
	unregisterPlugin: (name: string) => void;
	getFieldComponent: (
		fieldType: string,
	) => React.ComponentType<FieldComponentProps> | undefined;
	getValidator: (
		validatorName: string,
	) => ((value: unknown) => boolean | string) | undefined;
};

const PluginContext = createContext<PluginContextType | undefined>(undefined);

type PluginProviderProps = {
	children: ReactNode;
	initialPlugins?: PluginConfig[];
};

export const PluginProvider = ({
	children,
	initialPlugins = [],
}: PluginProviderProps) => {
	const plugins: Record<string, PluginConfig> = {};

	initialPlugins.forEach((plugin) => {
		plugins[plugin.name] = plugin;
	});

	const registerPlugin = (plugin: PluginConfig) => {
		plugins[plugin.name] = plugin;
	};

	const unregisterPlugin = (name: string) => {
		delete plugins[name];
	};

	const getFieldComponent = (
		fieldType: string,
	): React.ComponentType<FieldComponentProps> | undefined => {
		for (const plugin of Object.values(plugins)) {
			if (plugin.fieldTypes?.[fieldType]) {
				return plugin.fieldTypes[fieldType];
			}
		}
		return undefined;
	};

	const getValidator = (
		validatorName: string,
	): ((value: unknown) => boolean | string) | undefined => {
		for (const plugin of Object.values(plugins)) {
			if (plugin.validators?.[validatorName]) {
				return plugin.validators[validatorName];
			}
		}
		return undefined;
	};

	const contextValue: PluginContextType = {
		plugins,
		registerPlugin,
		unregisterPlugin,
		getFieldComponent,
		getValidator,
	};

	return (
		<PluginContext.Provider value={contextValue}>
			{children}
		</PluginContext.Provider>
	);
};

export const usePlugins = (): PluginContextType | undefined => {
	const context = useContext(PluginContext);
	return context;
};

export const createPlugin = (config: PluginConfig): PluginConfig => {
	return config;
};

export const withPlugins = <P extends object>(
	Component: React.ComponentType<P>,
	plugins: PluginConfig[] = [],
) => {
	return (props: P) => (
		<PluginProvider initialPlugins={plugins}>
			<Component {...props} />
		</PluginProvider>
	);
};
