#! /bin/bash
# . ./connect.sh to run

DURATION=21600

# Check if you have all the variables to run terraform
cred_check () {
    if [[ -z $AWS_USER ]]; then
     echo "Your AWS_USER is $(whoami)."
     echo "If that is not correct export AWS_USER in ~/.zshrc"
     export AWS_USER=$(whoami)
  fi
}

#Check if you added mfa
mfa () {
  if [[ -z $1 ]]; then
    echo "AWS MFA:"
    read MFA
  else
    MFA=$1
  fi
}

aws_cred () {
  unset AWS_ACCESS_KEY_ID
  unset AWS_SECRET_ACCESS_KEY
  unset AWS_SESSION_TOKEN
  unset AWS_EXPIRATION

  CREDS=`aws sts get-session-token --serial-number arn:aws:iam::464800036708:mfa/$AWS_USER --duration-seconds $DURATION --token-code $MFA`
  export AWS_ACCESS_KEY_ID=`echo $CREDS | jq .Credentials.AccessKeyId | tr -d '"'`
  export AWS_SECRET_ACCESS_KEY=`echo $CREDS | jq .Credentials.SecretAccessKey | tr -d '"'`
  export AWS_SESSION_TOKEN=`echo $CREDS | jq .Credentials.SessionToken | tr -d '"'`
  export AWS_EXPIRATION=`echo $CREDS | jq .Credentials.Expiration | tr -d '"'`
  export AWS_REGION=`echo eu-west-1`
  #terraform workspace select dev

  #echo "You are in the dev workspace, use \"terraform workspace select <dev/staging/prod>\" to switch between environments"
}

main () {
  cred_check
  mfa $1
  aws_cred $1
}

main $1
