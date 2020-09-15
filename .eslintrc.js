module.exports = {
	root: true,
	env: {
		node: true
	},
  extends: [
    'plugin:vue/essential'
  ],
  plugins: ['import'],
	globals: {
		Vue: true,
		Vuex: true,
		VueRouter: true,
		vant: true,
		axios: true,
		FastClick: true,
		ks: true,
		ksui: true
  },
  // https://cn.eslint.org/docs/rules/
	rules: {
    'camelcase': 0,
    'comma-dangle': [2, 'only-multiline'],
    'indent': 0,
    'no-extend-native': 2,
    'no-multiple-empty-lines': 0,
    'no-return-assign': 0,
    'object-curly-spacing': 0,
    'space-before-function-paren': [0, 'always'],
    'vue/no-use-v-if-with-v-for': 0,
    'prefer-const': 'off',
    'dot-notation': 0,
    'eol-last': 0,
    'semi': 0,
    'quotes': 0,
    'no-new': 0,
    'no-unused-vars': 0,
    'quote-props':[0, 'always'],
    'no-prototype-builtins': 'off',
		'no-console': 'off',
		'no-debugger': 'off'
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
}
