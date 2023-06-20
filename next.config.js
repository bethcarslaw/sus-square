/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

// Hack for BigInt serialization
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
BigInt.prototype.toJSON = function () {
  return this.toString();
};

module.exports = nextConfig;
