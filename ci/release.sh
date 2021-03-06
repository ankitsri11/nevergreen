#!/bin/bash -e

# deploy to production
scp -i /var/go/nevergreen_rsa ./target/nevergreen-standalone.jar nevergreen@nevergreen.io:/home/nevergreen/deploy/production
ssh -i /var/go/nevergreen_rsa nevergreen@nevergreen.io "sudo service nevergreen restart"

# smoke test
./ci/smoke-test.sh https://nevergreen.io/api/ping
